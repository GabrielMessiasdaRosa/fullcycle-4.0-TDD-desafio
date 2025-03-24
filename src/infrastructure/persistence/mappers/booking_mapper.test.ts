import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";

describe("BookingMapper", () => {
  it("deve converter BookingEntity em Booking corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Hotel";
    propertyEntity.description = "Hotel description";
    propertyEntity.maxGuests = 2;
    propertyEntity.basePricePerNight = 100;

    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "John";

    const dateRange = new DateRange(
      new Date("2022-01-01"),
      new Date("2022-01-02")
    );

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = dateRange.getStartDate();
    bookingEntity.endDate = dateRange.getEndDate();
    bookingEntity.guestCount = 2;
    bookingEntity.status = "CONFIRMED";
    const booking = BookingMapper.toDomain(bookingEntity);
    expect(booking).toBeInstanceOf(Booking);
    expect(booking.getId()).toBe("1");
    expect(booking.getProperty().getId()).toBe("1");
    expect(booking.getProperty().getName()).toBe("Hotel");
    expect(booking.getProperty().getDescription()).toBe("Hotel description");
    expect(booking.getProperty().getMaxGuests()).toBe(2);
    expect(booking.getProperty().getBasePricePerNight()).toBe(100);
    expect(booking.getUser().getId()).toBe("1");
    expect(booking.getUser().getName()).toBe("John");
    expect(booking.getDateRange().getStartDate()).toEqual(
      new Date("2022-01-01")
    );
    expect(booking.getDateRange().getEndDate()).toEqual(new Date("2022-01-02"));
    expect(booking.getGuestCount()).toBe(2);
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const property = new Property("1", "Hotel", "Hotel description", 2, 100);

    const user = new User("1", "John");

    const dateRange = new DateRange(
      new Date("2022-01-01"),
      new Date("2022-01-02")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    expect(BookingMapper.toPersistence(booking)).toMatchObject({
      id: "1",
      property: {
        id: "1",
        name: "Hotel",
        description: "Hotel description",
        maxGuests: 2,
        basePricePerNight: 100,
      },
      guest: {
        id: "1",
        name: "John",
      },
      startDate: dateRange.getStartDate(),
      endDate: dateRange.getEndDate(),
      guestCount: 2,
    });
  });

  describe("Validação de domínio", () => {
    it("Deve retornar true se o Booking for válido", () => {
      const property = new Property("1", "Hotel", "Hotel description", 2, 100);
      const user = new User("1", "John");
      const dateRange = new DateRange(
        new Date("2022-01-01"),
        new Date("2022-01-02")
      );
      const booking = new Booking("1", property, user, dateRange, 2);
      expect(BookingMapper.validateDomain(booking)).toBe(true);
    });
    describe("Deve verificar se os erros são lançados corretamente", () => {
      /**
       * Creates a valid Booking domain object for testing purposes.
       *
       * Scenarios:
       * - Property: Represents a property with an ID, name, description, capacity, and price.
       * - User: Represents a user with an ID and name.
       * - DateRange: Represents a date range with a start date and end date.
       * - Booking: Combines the property, user, date range, and number of guests into a booking instance.
       *
       * @returns {Booking} A valid Booking instance with predefined values.
       */
      const validDomain = (): Booking => {
        const property = new Property(
          "1",
          "Hotel",
          "Hotel description",
          2,
          100
        );
        const user = new User("1", "John");
        const dateRange = new DateRange(
          new Date("2022-01-01"),
          new Date("2022-01-02")
        );
        return new Booking("1", property, user, dateRange, 2);
      };
      test.each([
        ["property", "Booking must have a property"],
        ["guest", "Booking must have a guest"],
        ["dateRange", "Booking must have a date range"],
        ["guestCount", "Booking must have a guest count"],
        ["status", "Booking must have a status"],
      ])(
        "deve lançar erro se o Booking não tiver %s",
        (field, errorMessage) => {
          const booking = validDomain();
          delete booking[field as keyof Booking];
          expect(() => BookingMapper.validateDomain(booking)).toThrow(
            errorMessage
          );
        }
      );
    });
  });

  describe("Validação da entidade", () => {
    it("deve retornar true se o BookingEntity for válido", () => {
      const entity = new BookingEntity();
      entity.guest = new UserEntity();
      entity.property = new PropertyEntity();
      entity.startDate = new Date();
      entity.endDate = new Date();
      entity.guestCount = 1;
      entity.status = "CONFIRMED";

      expect(BookingMapper.validateEntity(entity)).toBe(true);
    });
    describe("Deve verificar se os erros são lançados corretamente", () => {
      const validEntity = (): BookingEntity => {
        const entity = new BookingEntity();
        entity.guest = new UserEntity();
        entity.property = new PropertyEntity();
        entity.startDate = new Date();
        entity.endDate = new Date();
        entity.guestCount = 1;
        entity.status = "CONFIRMED";
        return entity;
      };

      test.each([
        ["guest", "Booking must have a guest"],
        ["property", "Booking must have a property"],
        ["startDate", "Booking must have a start date"],
        ["endDate", "Booking must have an end date"],
        ["guestCount", "Booking must have a guest count"],
        ["status", "Booking must have a status"],
      ])(
        "deve lançar erro se o BookingEntity não tiver %s",
        (field, errorMessage) => {
          const entity = validEntity();
          delete entity[field as keyof BookingEntity];
          expect(() => BookingMapper.validateEntity(entity)).toThrow(
            errorMessage
          );
        }
      );

      it("Deve lançar erro se a data de início for maior que a data de término", () => {
        const entity = validEntity();
        entity.startDate = new Date("2022-01-02");
        entity.endDate = new Date("2022-01-01");
        expect(() => BookingMapper.validateEntity(entity)).toThrow(
          "Booking start date must be before end date"
        );
      });
    });
  });
});
