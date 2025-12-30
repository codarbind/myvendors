import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorsRepository } from './vendors.repository';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Types } from 'mongoose';
import { SearchVendorDto } from './dto/search-vendor.dto';
import { VendorListDto, VendorListResponseDto } from './dto/getAllVendors.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly repo: VendorsRepository) { }

  create(dto: CreateVendorDto) {
    dto.addedBy = new Types.ObjectId(dto.addedBy)

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

  async list(dto: VendorListDto): Promise<VendorListResponseDto> {
    const { vendors, total } = await this.repo.paginate({
      page: dto.page,
      limit: dto.limit,
      includeHidden: dto.includeHidden,
      q: dto.q,
      specialty: dto.specialty,
      deleted:  false,
    });

    return {
      vendors,
      total,
      page: dto.page || 1,
      totalPages: Math.ceil(total / (dto.limit || 10)),
    };
  }

  async search(queries: SearchVendorDto) {
    const { q, specialty } = queries;

    const filter: any = {
      deleted: false,
      isVisible: true,
    };

    if (specialty) {
      filter.specialty = new RegExp(`^${specialty}$`, 'i'); // case-insensitive exact match
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    const vendors = await this.repo
      .paginate({ q, specialty })

    return vendors
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
