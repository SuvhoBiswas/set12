class SupplyChainSystem {
  // 1. Access Control Layer
  class AccessControl {
    constructor() {
      this.organizations = new Map(); // { orgId: {roles: []} }
      this.userRoles = new Map();     // { userId: [roles] }
    }

    registerOrganization(orgId, roles) {
      this.organizations.set(orgId, { roles });
    }

    assignRole(userId, role, orgId) {
      if (!this.organizations.has(orgId)) throw new Error("Org not found");
      const userRoles = this.userRoles.get(userId) || [];
      userRoles.push({ role, orgId });
      this.userRoles.set(userId, userRoles);
    }

    hasAccess(userId, requiredRole, orgId) {
      const roles = this.userRoles.get(userId) || [];
      return roles.some(r => r.role === requiredRole && r.orgId === orgId);
    }
  }

  // 2. Tracking Service (IoT + Blockchain)
  class TrackingService {
    constructor(blockchain) {
      this.blockchain = blockchain; // Fabric/Quorum
    }

    ingestIoTData(productId, data) {
      const record = {
        productId,
        timestamp: Date.now(),
        temperature: data.temperature,
        location: data.location
      };
      this.blockchain.write("trackProduct", record);
    }

    getRealTimeStatus(productId) {
      return this.blockchain.query("getProductHistory", { productId });
    }
  }

  // 3. Compliance Module
  class ComplianceReporter {
    constructor(blockchain) {
      this.blockchain = blockchain;
    }

    generateAudit(productId) {
      const history = this.blockchain.query("getProductHistory", { productId });
      return {
        productId,
        auditTrail: history,
        generatedAt: new Date().toISOString()
      };
    }

    generateRegulatoryReport() {
      // Filter for violations, compliance data
      const violations = this.blockchain.query("getComplianceViolations");
      return {
        reportId: `reg-${Date.now()}`,
        violations,
        total: violations.length,
        generatedAt: new Date().toISOString()
      };
    }
  }

  // 4. High Availability Setup
  setupHA() {
    return {
      loadBalancers: ["HAProxy", "Nginx"],
      cloudRegions: ["us-east-1", "ap-southeast-1"],
      failover: {
        activePrimary: true,
        replication: "real-time",
        heartbeatInterval: "5s"
      }
    };
  }
}
