# Bug fixes PR

## 📋 Overview

This PR introduces significant enhancements to the vehicle management system, including:

1. **Vehicle Location Tracking System** - Complete database schema and API support for storing and retrieving vehicle location history
2. **Reservation Date Validation** - Prevents users from creating reservations with departure dates in the past
3. **Enhanced Vehicle API Response** - Updated GET vehicle endpoint to include complete location history and related data

## 🗄️ Database Schema Changes

### New Table: `tbl_vehicle_locations`

**File:** `prisma/schema.prisma`

```prisma
model tbl_vehicle_locations {
  location_id String @id @default(uuid())
  vehicle_id  String
  coords      Json      // GPS coordinates object
  timestamp   DateTime @default(now())
  vehicle     tbl_vehicles @relation(fields: [vehicle_id], references: [vehicle_id])
}
```

**Schema Details:**
- `location_id`: Primary key (UUID)
- `vehicle_id`: Foreign key to `tbl_vehicles`
- `coords`: JSON field storing GPS coordinates (latitude, longitude, altitude, accuracy, etc.)
- `timestamp`: Automatic timestamp for location record
- **Relationship**: Linked to `tbl_vehicles` table

## 🚀 API Enhancements

### 1. Vehicle Location Storage

**File:** `src/services/vehicle.services.ts`

**Changes:**
- Modified `saveAndBroadcastLocation()` function to persist location data in database
- Added database insertion before broadcasting to SSE clients
- Updated Location interface to support Date type for timestamps

**Code Changes:**
```typescript
// Before: Only stored in memory
vehicleLocations.set(vehicle_id, location);

// After: Persist to database + memory
await prisma.tbl_vehicle_locations.create({
  data: {
    vehicle_id,
    coords: JSON.stringify(location.coords),
    timestamp: new Date(location.timestamp as string | number),
  },
});
```

### 2. Enhanced Vehicle Details Endpoint

**Files:** 
- `src/routes/vehicle.routes.ts` (Swagger documentation)
- `src/services/vehicle.services.ts` (Service layer)

**Changes:**
- Updated `getVehicleById()` to include location history
- Added comprehensive Swagger documentation with nested schemas
- Enhanced response structure to include organization, vehicle model, and location data

**New Response Structure:**
```json
{
  "data": {
    "vehicle_id": "uuid",
    "plate_number": "RAC123A",
    "transmission_mode": "MANUAL",
    "vehicle_model_id": "uuid",
    "vehicle_photo": "https://example.com/photo.jpg",
    "vehicle_year": 2020,
    "vehicle_status": "AVAILABLE",
    "energy_type": "Diesel",
    "last_service_date": "2024-01-15T10:30:00.000Z",
    "created_at": "2024-01-01T08:00:00.000Z",
    "organization_id": "uuid",
    "organization": { /* complete organization object */ },
    "vehicle_model": { /* complete vehicle model object */ },
    "locations": [
      {
        "location_id": "uuid",
        "vehicle_id": "uuid",
        "coords": {
          "latitude": -1.2921,
          "longitude": 36.8219,
          "altitude": 1685.4,
          "accuracy": 10.5,
          "altitudeAccuracy": 2.3,
          "heading": 45.2,
          "speed": 5.8
        },
        "timestamp": "2024-03-15T14:30:00.000Z"
      }
    ]
  }
}
```

### 3. New Swagger Schemas

**File:** `src/routes/vehicle.routes.ts`

**Added Schemas:**
- `Organization`: Complete organization object with all fields
- `VehicleLocation`: Location object with GPS coordinates and timestamp
- `Coords`: GPS coordinates following Geolocation API standard

**Enhanced Documentation:**
- Added proper UUID and URI formats
- Comprehensive example with realistic data
- Complete nested object documentation

## 🛡️ Business Logic Improvements

### Reservation Date Validation

**File:** `src/controllers/reservation.controllers.ts`

**New Validation Rules:**
- **Departure Date**: Cannot be in the past
- **Return Date**: Must be after departure date
- **Error Handling**: Clear error messages for validation failures

**Implementation:**
```typescript
if (req.body.departure_date && req.body.expected_returning_date) {
  const departure = new Date(req.body.departure_date);
  const returnDate = new Date(req.body.expected_returning_date);
  const now = new Date();
  
  if (departure < now) {
    throw new Error('Departure date cannot be in the past');
  }
  
  if (returnDate <= departure) {
    throw new Error('Return date must be after departure date');
  }
}
```

## 📊 GPS Coordinates Structure

The `coords` object follows the **Geolocation API standard**:

```typescript
{
  latitude: number,           // -90 to 90
  longitude: number,          // -180 to 180  
  altitude: number | null,    // meters above sea level
  accuracy: number,           // accuracy in meters
  altitudeAccuracy: number | null, // altitude accuracy in meters
  heading: number | null,     // degrees from true north (0-360)
  speed: number | null        // speed in meters per second
}
```

## 🔧 Technical Implementation Details

### Database Relationships
- `tbl_vehicles` → `tbl_vehicle_locations` (One-to-Many)
- Location data is stored as JSON for flexibility
- Automatic timestamp generation for location records

### API Performance Considerations
- Location history is included in vehicle details response
- Consider pagination for vehicles with extensive location history
- SSE streaming remains unaffected for real-time updates

### Error Handling
- Comprehensive validation for reservation dates
- Database error handling for location storage
- Maintained existing error response patterns

## 🧪 Testing Recommendations

### Manual Testing Scenarios
1. **Vehicle Location Tracking**:
   - Submit location updates via POST `/v2/vehicles/{id}/locations`
   - Verify data persistence in database
   - Check location history in GET `/v2/vehicles/{id}` response

2. **Reservation Validation**:
   - Attempt reservation with past departure date
   - Attempt reservation with return date before departure
   - Verify error messages and response codes

3. **API Documentation**:
   - Verify Swagger UI displays new schemas correctly
   - Test example response matches actual API output


## 📝 Breaking Changes

### API Response Changes
- **GET `/v2/vehicles/{id}`** now includes additional fields:
  - `organization` (object)
  - `vehicle_model` (object) 
  - `locations` (array)

**Impact:** Clients should be updated to handle the new nested structure. Existing fields remain unchanged.

## 🔄 Migration Notes

### Database Migration
- Run `prisma migrate dev` to apply the new `tbl_vehicle_locations` table
- No existing data migration required

### API Client Updates
- Update client code to handle enhanced vehicle response structure
- Consider implementing pagination for location history if needed
