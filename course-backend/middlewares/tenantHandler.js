const dbMiddleware = (db) => (req, res, next) => {
  req.db = db; // Attach the database instance to the request object
  next();
};

async function pickTenant(req, res, next) {
  try {
    const tenantName = req.headers["x-tenant"]; // Example: Get tenant from request header

    if (!tenantName || !req.db[tenantName]) {
      return res.status(400).json({ error: "Invalid or missing tenant" });
    }

    req.tenant = req.db[tenantName]; // Attach tenant-specific DB to request
    next();
  } catch (error) {
    console.error("Error in pickTenant middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { dbMiddleware, pickTenant };
