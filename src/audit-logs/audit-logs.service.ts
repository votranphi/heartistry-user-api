import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogsService {
    constructor (
        @InjectRepository(AuditLog) private readonly auditLogsRepository: Repository<AuditLog>, 
    ) {}

    async save(auditLog): Promise<AuditLog> {
        const savedAuditLog = new AuditLog();

        savedAuditLog.action = auditLog.action;
        savedAuditLog.entity = auditLog.entity;
        savedAuditLog.entityId = auditLog.entityId;
        savedAuditLog.userId = auditLog.userId;
        savedAuditLog.username = auditLog.username;
        savedAuditLog.role = auditLog.role;
        savedAuditLog.details = auditLog.details;

        return await this.auditLogsRepository.save(savedAuditLog);
    }

    async getAllAuditLogs() {
        return await this.auditLogsRepository.find();
    }
}
