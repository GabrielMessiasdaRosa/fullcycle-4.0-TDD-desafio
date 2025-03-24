import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  async createProperty(req: Request, res: Response) {
    try {
      const { name, description, maxGuests, basePricePerNight } = req.body;
      const body = {
        name,
        description,
        maxGuests,
        basePricePerNight,
      };
      if (!name) {
        return res
          .status(400)
          .json({ message: "O nome da propriedade é obrigatório." });
      }
      if (!maxGuests || maxGuests <= 0) {
        return res
          .status(400)
          .json({ message: "A capacidade máxima deve ser maior que zero." });
      }
      if (!basePricePerNight || basePricePerNight <= 0) {
        return res
          .status(400)
          .json({ message: "O preço base por noite é obrigatório." });
      }
      const property = await this.propertyService.createProperty(body);
      return res.status(201).json(property);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
