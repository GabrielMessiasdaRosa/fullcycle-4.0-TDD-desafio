import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
  it("deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Test Property";
    propertyEntity.description = "A test property";
    propertyEntity.maxGuests = 4;
    propertyEntity.basePricePerNight = 100;

    const property = PropertyMapper.toDomain(propertyEntity);

    expect(property.getId()).toBe(propertyEntity.id);
    expect(property.getName()).toBe(propertyEntity.name);
    expect(property.getDescription()).toBe(propertyEntity.description);
    expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
    expect(property.getBasePricePerNight()).toBe(
      propertyEntity.basePricePerNight
    );
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      "1",
      "Test Property",
      "A test property",
      4,
      100
    );

    const propertyEntity = PropertyMapper.toPersistence(property);

    expect(propertyEntity.id).toBe(property.getId());
    expect(propertyEntity.name).toBe(property.getName());
    expect(propertyEntity.description).toBe(property.getDescription());
    expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
    expect(propertyEntity.basePricePerNight).toBe(
      property.getBasePricePerNight()
    );
  });

  describe("Validação de domínio", () => {
    it("deve retornar true se o domínio for válido", () => {
      const property = new Property(
        "1",
        "Test Property",
        "A test property",
        4,
        100
      );
      expect(PropertyMapper.validateDomain(property)).toBe(true);
    });
    describe("Deve verificar se os erros são lançados corretamente", () => {
      const validDomain = (): Property => {
        return new Property("1", "Test Property", "A test property", 4, 100);
      };

      test.each([
        ["id", "Property id not found"],
        ["name", "Property name not found"],
        ["description", "Property description not found"],
        ["maxGuests", "Property maxGuests not found"],
        ["basePricePerNight", "Property basePricePerNight not found"],
      ])(
        "deve lançar erro se o Property não tiver %s",
        (field, errorMessage) => {
          const domain = validDomain();
          (domain as any)[field] = undefined;
          expect(() => PropertyMapper.validateDomain(domain)).toThrow(
            errorMessage
          );
        }
      );
    });
  });

  describe("Validação de entidade", () => {
    it("deve retornar true se a entidade for válida", () => {
      const propertyEntity = new PropertyEntity();
      propertyEntity.id = "1";
      propertyEntity.name = "Test Property";
      propertyEntity.description = "A test property";
      propertyEntity.maxGuests = 4;
      propertyEntity.basePricePerNight = 100;
      expect(PropertyMapper.validateEntity(propertyEntity)).toBe(true);
    });
    describe("Deve verificar se os erros são lançados corretamente", () => {
      const validEntity = (): PropertyEntity => {
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Test Property";
        propertyEntity.description = "A test property";
        propertyEntity.maxGuests = 4;
        propertyEntity.basePricePerNight = 100;
        return propertyEntity;
      };

      test.each([
        ["id", "Property id not found"],
        ["name", "Property name not found"],
        ["description", "Property description not found"],
        ["maxGuests", "Property maxGuests not found"],
        ["basePricePerNight", "Property basePricePerNight not found"],
      ])(
        "deve lançar erro se o PropertyEntity não tiver %s",
        (field, errorMessage) => {
          const entity = validEntity();
          delete entity[field as keyof PropertyEntity];
          expect(() => PropertyMapper.validateEntity(entity)).toThrow(
            errorMessage
          );
        }
      );
    });
  });
});
