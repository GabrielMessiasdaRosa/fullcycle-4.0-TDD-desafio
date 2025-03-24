import { Booking } from "../../../domain/entities/booking";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

export class BookingMapper {
  static toDomain(entity: BookingEntity): Booking {
    this.validateEntity(entity);
    const guest = UserMapper.toDomain(entity.guest);
    const dateRange = new DateRange(entity.startDate, entity.endDate);
    const property = PropertyMapper.toDomain(entity.property);
    const booking = new Booking(
      entity.id,
      property,
      guest,
      dateRange,
      entity.guestCount
    );
    booking["totalPrice"] = Number(entity.totalPrice);
    booking["status"] = entity.status;
    return booking;
  }

  static toPersistence(domain: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = domain.getId();
    entity.property = PropertyMapper.toPersistence(domain.getProperty());
    entity.guest = UserMapper.toPersistence(domain.getGuest());
    entity.startDate = domain.getDateRange().getStartDate();
    entity.endDate = domain.getDateRange().getEndDate();
    entity.guestCount = domain.getGuestCount();
    entity.totalPrice = domain.getTotalPrice();
    entity.status = domain.getStatus();
    return entity;
  }

  static validateDomain(domain: Booking): boolean {
    if (!domain.getProperty()) throw new Error("Booking must have a property");
    if (!domain.getGuest()) throw new Error("Booking must have a guest");
    if (!domain.getDateRange())
      throw new Error("Booking must have a date range");
    if (domain.getGuestCount() === undefined || domain.getGuestCount() === null)
      throw new Error("Booking must have a guest count");
    if (!domain.getStatus()) throw new Error("Booking must have a status");
    return true;
  }

  static validateEntity(entity: BookingEntity): boolean {
    if (!entity.guest) throw new Error("Booking must have a guest");
    if (!entity.property) throw new Error("Booking must have a property");
    if (entity.startDate > entity.endDate)
      throw new Error("Booking start date must be before end date");
    if (!entity.startDate) throw new Error("Booking must have a start date");
    if (!entity.endDate) throw new Error("Booking must have an end date");
    if (!entity.guestCount) throw new Error("Booking must have a guest count");
    if (!entity.status) throw new Error("Booking must have a status");
    return true;
  }
}
