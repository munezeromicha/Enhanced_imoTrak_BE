import { PrismaClient, DriverStatus } from '@prisma/client';
import { AppError } from '../utils/Error';

const prisma = new PrismaClient();

export async function createDriver(data: {
  user_id: string;
  license_number: string;
  license_category: string;
  experience_years: number;
}) {
  // Check if user already has a driver profile
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

export async function getAllDrivers(organizationId: string) {
  return prisma.tbl_drivers.findMany({
    where: {
      user: {
        positions: {
          some: {
            unit: {
              organization_id: organizationId,
            },
          },
        },
      },
    },
    include: {
      user: true,
      assignments: {
        where: {
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
              reservation: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
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
