import { Controller, ForbiddenException, Get, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtGuard } from './guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuditLog } from './entities/audit-log.entity';

@Controller('audit-logs')
export class AuditLogsController {
    constructor(
        private readonly auditLogsService: AuditLogsService,
    ) { }

    @ApiBearerAuth()
    @ApiOperation({
        summary: "Get all audit logs (Admin only)",
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized request",
        example: new UnauthorizedException().getResponse()
    })
    @ApiForbiddenResponse({
        description: "Forbidden request",
        example: new ForbiddenException("Access denied: Admins only").getResponse()
    })
    @ApiOkResponse({
        description: "Returns all audit logs",
        type: [AuditLog]
    })
    @UseGuards(JwtGuard, AdminGuard)
    @Get('all')
    async getAllAuditLogs() {
        return await this.auditLogsService.getAllAuditLogs();
    }
}
