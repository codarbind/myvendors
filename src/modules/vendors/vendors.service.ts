import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorsRepository } from './vendors.repository';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly repo: VendorsRepository) {}

  create(dto: CreateVendorDto) {
    return this.repo.create(dto);
  }

  async getById(id: string) {
    const vendor = await this.repo.findById(id);
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  getByWhatsapp(whatsapp: string) {
    return this.repo.findByWhatsapp(whatsapp);
  }

  async list(page: number, limit: number, includeHidden: boolean) {
    const { vendors, total } = await this.repo.paginate(
      page,
      limit,
      includeHidden,
    );

    return {
      vendors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  incrementView(whatsapp: string) {
    return this.repo.incrementView(whatsapp);
  }

  incrementShare(whatsapp: string) {
    return this.repo.incrementShare(whatsapp);
  }

  toggleVisibility(id: string, isVisible: boolean) {
    return this.repo.toggleVisibility(id, isVisible);
  }

  delete(id: string) {
    return this.repo.softDelete(id);
  }
}
