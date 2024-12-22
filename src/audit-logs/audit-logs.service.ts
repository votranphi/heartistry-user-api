import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogsService {
    constructor (
        @InjectRepository(AuditLog) private readonly auditLogsRepository: Repository<AuditLog>, 
    ) {}

    async save({ action, entity, entityId, userId, username, role, ipAddress, details }: AuditLog): Promise<AuditLog> {
        const savedAuditLog = new AuditLog();

        savedAuditLog.action = action;
        savedAuditLog.entity = entity;
        savedAuditLog.entityId = entityId;
        savedAuditLog.userId = userId;
        savedAuditLog.username = username;
        savedAuditLog.role = role;
        savedAuditLog.ipAddress = ipAddress;
        savedAuditLog.details = details;

        return await this.auditLogsRepository.save(savedAuditLog);
    }
}
