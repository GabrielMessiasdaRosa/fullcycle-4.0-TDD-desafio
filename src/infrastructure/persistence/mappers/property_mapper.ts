import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    this.validateEntity(entity);
    return new Property(
      entity.id,
      entity.name,
      entity.description,
      entity.maxGuests,
      Number(entity.basePricePerNight)
    );
  }

  static toPersistence(domain: Property): PropertyEntity {
    this.validateDomain(domain);
    const entity = new PropertyEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.description = domain.getDescription();
    entity.maxGuests = domain.getMaxGuests();
    entity.basePricePerNight = domain.getBasePricePerNight();
    return entity;
  }

  static validateDomain(domain: Property): boolean {
    if (!domain.getId()) throw new Error("Property id not found");
    if (!domain.getName()) throw new Error("Property name not found");
    if (!domain.getDescription())
      throw new Error("Property description not found");
    if (!domain.getMaxGuests()) throw new Error("Property maxGuests not found");
    if (!domain.getBasePricePerNight())
      throw new Error("Property basePricePerNight not found");
    return true;
  }

  static validateEntity(entity: PropertyEntity): boolean {
    if (!entity.id) throw new Error("Property id not found");
    if (!entity.name) throw new Error("Property name not found");
    if (!entity.description) throw new Error("Property description not found");
    if (!entity.maxGuests) throw new Error("Property maxGuests not found");
    if (!entity.basePricePerNight)
      throw new Error("Property basePricePerNight not found");
    return true;
  }
}
