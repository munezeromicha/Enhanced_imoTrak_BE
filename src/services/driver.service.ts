import { PrismaClient, DriverStatus } from '@prisma/client';
import { AppError } from '../utils/Error';

const prisma = new PrismaClient();

export async function createDriver(
  data: {
    user_id: string;
    license_number: string;
    license_category: string;
    experience_years: number;
  },
  organizationId: string
) {
  const userInOrg = await prisma.tbl_user_position_assignments.findFirst({
    where: {
      user_id: data.user_id,
      position: {
        unit: { organization_id: organizationId },
      },
    },
  });
  if (!userInOrg) {
    throw new AppError(
      'User must be assigned to a position in your organization before becoming a driver',
      400
    );
  }

  const existingDriver = await prisma.tbl_drivers.findUnique({
    where: { user_id: data.user_id },
  });
  if (existingDriver) {
    throw new AppError('Driver profile already exists for this user', 400);
  }

  // Check if license number is unique
  const existingLicense = await prisma.tbl_drivers.findUnique({
    where: { license_number: data.license_number },
  });
  if (existingLicense) {
    throw new AppError('License number is already registered', 400);
  }

  return prisma.tbl_drivers.create({
    data: {
      user_id: data.user_id,
      license_number: data.license_number,
      license_category: data.license_category,
      experience_years: data.experience_years,
      driver_status: DriverStatus.AVAILABLE,
    },
    include: {
      user: true,
    },
  });
}

export async function updateDriver(
  driverId: string,
  data: {
    license_number?: string;
    license_category?: string;
    experience_years?: number;
    driver_status?: DriverStatus;
  }
) {
  const driver = await prisma.tbl_drivers.findUnique({
    where: { driver_id: driverId },
  });
  if (!driver) {
    throw new AppError('Driver profile not found', 404);
  }

  if (data.license_number && data.license_number !== driver.license_number) {
    const existingLicense = await prisma.tbl_drivers.findUnique({
      where: { license_number: data.license_number },
    });
    if (existingLicense) {
      throw new AppError('License number is already registered', 400);
    }
  }

  return prisma.tbl_drivers.update({
    where: { driver_id: driverId },
    data,
    include: {
      user: true,
    },
  });
}

export async function getDriverById(driverId: string) {
  const driver = await prisma.tbl_drivers.findUnique({
    where: { driver_id: driverId },
    include: {
      user: true,
    },
  });
  if (!driver) {
    throw new AppError('Driver profile not found', 404);
  }
  return driver;
}

export async function getDriverByUserId(userId: string) {
  return prisma.tbl_drivers.findUnique({
    where: { user_id: userId },
    include: {
      user: true,
    },
  });
}

const driverInclude = {
  user: true,
  assignments: {
    where: { is_active: true },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: {
            include: {
              vehicle_model: true,
            },
          },
          reservation: true,
        },
      },
    },
  },
} as const;

export async function getAllDrivers(organizationId: string) {
  const orgAssignments = await prisma.tbl_user_position_assignments.findMany({
    where: {
      position: {
        unit: { organization_id: organizationId },
      },
    },
    select: { user_id: true },
  });

  const userIds = [...new Set(orgAssignments.map((a) => a.user_id))];

  const [byOrgUsers, byOrgFleet] = await Promise.all([
    userIds.length > 0
      ? prisma.tbl_drivers.findMany({
          where: { user_id: { in: userIds } },
          include: driverInclude,
        })
      : Promise.resolve([]),
    prisma.tbl_drivers.findMany({
      where: {
        assignments: {
          some: {
            reserved_vehicle: {
              vehicle: { organization_id: organizationId },
            },
          },
        },
      },
      include: driverInclude,
    }),
  ]);

  const merged = new Map<string, (typeof byOrgUsers)[number]>();
  for (const driver of [...byOrgUsers, ...byOrgFleet]) {
    merged.set(driver.driver_id, driver);
  }

  return Array.from(merged.values()).sort(
    (a, b) => b.created_at.getTime() - a.created_at.getTime()
  );
}

export async function getDriverTripHistory(driverId: string) {
  const driver = await prisma.tbl_drivers.findUnique({
    where: { driver_id: driverId },
  });
  if (!driver) {
    throw new AppError('Driver not found', 404);
  }

  return prisma.tbl_reserved_vehicle_drivers.findMany({
    where: {
      driver_id: driverId,
    },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: {
            include: {
              vehicle_model: true,
            },
          },
          reservation: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      assigned_at: 'desc',
    },
  });
}

export async function getDriverActiveTrip(driverId: string) {
  const driver = await prisma.tbl_drivers.findUnique({
    where: { driver_id: driverId },
  });
  if (!driver) {
    throw new AppError('Driver not found', 404);
  }

  return prisma.tbl_reserved_vehicle_drivers.findFirst({
    where: {
      driver_id: driverId,
      is_active: true,
    },
    include: {
      reserved_vehicle: {
        include: {
          vehicle: {
            include: {
              vehicle_model: true,
            },
          },
          reservation: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
}
