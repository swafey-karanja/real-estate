"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listApplications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, userType } = req.query;
        let whereClause = {};
        if (userId && userType) {
            if (userType === "tenant") {
                whereClause = { tenantId: String(userId) };
            }
            else if (userType === "manager") {
                whereClause = { property: { managerId: String(userId) } };
            }
        }
        const applications = yield prisma.application.findMany({
            where: whereClause,
            include: {
                property: { include: { location: true, manager: true } },
                tenant: true,
            },
        });
        function calculateNextPaymentDate(startDate) {
            const today = new Date();
            const nextPaymentDate = new Date(startDate);
            while (nextPaymentDate <= today) {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            }
            return nextPaymentDate;
        }
        const formattedApplications = yield Promise.all(applications.map((application) => __awaiter(void 0, void 0, void 0, function* () {
            const lease = yield prisma.lease.findFirst({
                where: {
                    tenant: {
                        cognitoId: application.tenantCognitoId,
                    },
                    propertyId: application.propertyId,
                },
                orderBy: { startDate: "desc" },
            });
            return Object.assign(Object.assign({}, application), { property: Object.assign(Object.assign({}, application), { address: application.property.location.address }), manager: application.property.manager, lease: lease
                    ? Object.assign(Object.assign({}, lease), { nextPaymentDate: calculateNextPaymentDate(lease.startDate) }) : null });
        })));
        res.json(formattedApplications);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving applications: ${error.message}` });
    }
});
exports.listApplications = listApplications;
