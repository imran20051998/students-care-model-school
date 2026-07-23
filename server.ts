import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { ExamSeatPlan } from "./src/db/seatPlanSchema";
import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      user: "u398502275_admin",
      password: "Cisfa1998$#@",
      database: "u398502275_StudentsCare",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// Set up directory paths
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const DB_FILE = path.join(process.cwd(), "db_store.json");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, JPG, and WEBP image formats are allowed"));
    }
  },
});

// Mock database structures
interface SchoolSettings {
  siteNameBn: string;
  siteNameEn: string;
  addressBn: string;
  addressEn: string;
  eiin: string;
  foundedYear: string;
  helpline: string;
  email: string;
  website: string;
  bannerColor: string;
  bannerFontSize: number;
  bannerGradient: boolean;
  logoUrl: string;
}

interface Student {
  sl: number;
  photo: string;
  roll: string;
  name: string;
  class: string;
  section: string;
  guardian: string;
  phone: string;
  created_at: string;
}

interface Attendance {
  working: number;
  present: number;
  percentage: number;
  grade: string;
}

interface Mark {
  subject: string;
  theory: number;
  mcq: number;
  practical: number;
  highest: number;
  total: number;
  grade: string;
  gp: number;
  combined: boolean;
  papers?: string[];
}

interface StudentRecord {
  sl: number;
  attendance: Attendance;
  marks: Mark[];
  remarks: string;
}

interface DatabaseStore {
  settings: SchoolSettings;
  slider: any[] | null;
  students: Student[];
  examSeatPlans: ExamSeatPlan[];
  studentRecords: StudentRecord[];
}

const DEFAULT_SETTINGS: SchoolSettings = {
  siteNameBn: "স্টুডেন্টস কেয়ার মডেল স্কুল",
  siteNameEn: "Students Care Model School",
  addressBn: "কর্ণফুলী, চট্টগ্রাম",
  addressEn: "Karnafuli, Chattogram",
  eiin: "134256",
  foundedYear: "২০১৫",
  helpline: "01812-345678",
  email: "info@studentscaremodel.edu.bd",
  website: "www.studentscaremodel.edu.bd",
  bannerColor: "#025644",
  bannerFontSize: 32,
  bannerGradient: true,
  logoUrl: "",
};

const INITIAL_STUDENTS: Student[] = [
  {
    sl: 1024,
    photo: "",
    roll: "12",
    name: "Aarav Hossain",
    class: "Class VIII",
    section: "A",
    guardian: "Rashid Hossain",
    phone: "01711223344",
    created_at: new Date().toISOString(),
  },
  {
    sl: 1025,
    photo: "",
    roll: "05",
    name: "Maya Rahman",
    class: "Class VI",
    section: "B",
    guardian: "Sumi Rahman",
    phone: "01712998877",
    created_at: new Date().toISOString(),
  },
  {
    sl: 1026,
    photo: "",
    roll: "18",
    name: "Tanvir Ahmed",
    class: "Class IX",
    section: "A",
    guardian: "Karim Ahmed",
    phone: "01718554433",
    created_at: new Date().toISOString(),
  },
  {
    sl: 1027,
    photo: "",
    roll: "22",
    name: "Nadia Islam",
    class: "Class VII",
    section: "C",
    guardian: "Lipi Islam",
    phone: "01719112233",
    created_at: new Date().toISOString(),
  },
];

// Read database or initialize
function getDb(): DatabaseStore {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch (e) {
      console.error("Error parsing db_store.json, resetting to defaults", e);
    }
  }
  const initialDb: DatabaseStore = {
    settings: DEFAULT_SETTINGS,
    slider: null,
    students: INITIAL_STUDENTS,
    examSeatPlans: [],
    studentRecords: [],
  };
  saveDb(initialDb);
  return initialDb;
}

function saveDb(db: DatabaseStore) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static uploads
  app.use("/uploads", express.static(UPLOADS_DIR));
  app.use("/php_backend/uploads", express.static(UPLOADS_DIR));
  app.use("/public/php_backend/uploads", express.static(UPLOADS_DIR));

  // CORS headers
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // ==========================================
  // API Routes representing PHP Endpoints
  // ==========================================

  // 1. Get Settings & Banner (get_banner.php)
  const getBannerHandler = (req: Request, res: Response) => {
    const db = getDb();
    res.json({
      status: "success",
      settings: db.settings,
      slider: db.slider,
    });
  };
  app.get("/get_banner.php", getBannerHandler);
  app.get("/php_backend/get_banner.php", getBannerHandler);
  app.get("/public/php_backend/get_banner.php", getBannerHandler);

  // 2. Save Settings & Banner (save_banner.php)
  const saveBannerHandler = (req: Request, res: Response) => {
    upload.single("logo")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ status: "error", message: err.message });
      }

      const db = getDb();
      const body = req.body;

      let logoUrl = db.settings.logoUrl;
      if (req.file) {
        logoUrl = "php_backend/uploads/" + req.file.filename;
      } else if (body.logoUrl !== undefined) {
        logoUrl = body.logoUrl;
      }

      db.settings = {
        siteNameBn: body.siteNameBn || db.settings.siteNameBn,
        siteNameEn: body.siteNameEn || db.settings.siteNameEn,
        addressBn: body.addressBn || db.settings.addressBn,
        addressEn: body.addressEn || db.settings.addressEn,
        eiin: body.eiin || db.settings.eiin,
        foundedYear: body.foundedYear || db.settings.foundedYear,
        helpline: body.helpline || db.settings.helpline,
        email: body.email || db.settings.email,
        website: body.website || db.settings.website,
        bannerColor: body.bannerColor || db.settings.bannerColor,
        bannerFontSize: body.bannerFontSize ? parseInt(body.bannerFontSize, 10) : db.settings.bannerFontSize,
        bannerGradient: body.bannerGradient === "true" || body.bannerGradient === "1" || body.bannerGradient === true,
        logoUrl,
      };

      saveDb(db);

      res.json({
        status: "success",
        message: "Settings and banner parameters saved successfully!",
        settings: db.settings,
      });
    });
  };
  app.post("/save_banner.php", saveBannerHandler);
  app.post("/php_backend/save_banner.php", saveBannerHandler);
  app.post("/public/php_backend/save_banner.php", saveBannerHandler);

  // 3. Save Slider (save_slider.php)
  const saveSliderHandler = (req: Request, res: Response) => {
    const db = getDb();
    let sliderJson = req.body.slider;

    if (!sliderJson && req.body) {
      if (req.body.slider !== undefined) {
        sliderJson = req.body.slider;
      } else if (Array.isArray(req.body)) {
        sliderJson = req.body;
      }
    }

    if (typeof sliderJson === "string") {
      try {
        db.slider = JSON.parse(sliderJson);
      } catch (e) {
        return res.status(400).json({ status: "error", message: "Invalid slider JSON format" });
      }
    } else if (Array.isArray(sliderJson)) {
      db.slider = sliderJson;
    } else if (sliderJson) {
      db.slider = [sliderJson];
    }

    saveDb(db);

    res.json({
      status: "success",
      message: "Slider parameters saved successfully!",
      slider: db.slider,
    });
  };
  app.post("/save_slider.php", saveSliderHandler);
  app.post("/php_backend/save_slider.php", saveSliderHandler);
  app.post("/public/php_backend/save_slider.php", saveSliderHandler);

  // 4. Insert Student (insert.php)
  const insertStudentHandler = async (req: Request, res: Response) => {
    console.log("Received request for /insert.php");
    console.log("Body:", req.body);
    upload.single("photo")(req, res, async (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ status: "error", message: err.message });
      }

      console.log("File:", req.file);
      const body = req.body;
      const roll = body.roll;
      const name = body.name;
      const className = body.class;
      const section = body.section || "A";
      const guardian = body.guardian || "N/A";
      const phone = body.phone;

      console.log("Extracted Data:", { roll, name, className, section, guardian, phone });

      if (!roll || !name || !className || !phone) {
        console.log("Validation failed");
        return res.status(400).json({
          status: "error",
          message: "Validation Failed: Roll, Name, Class, and Phone Number are mandatory.",
        });
      }

      const db = getDb();

      // Check duplicate in same class
      const exists = db.students.some(
        (s) => s.class.toLowerCase() === className.toLowerCase() && s.roll === roll
      );

      if (exists) {
        return res.status(400).json({
          status: "error",
          message: "Integrity constraint violation: This roll number is already taken in this class.",
        });
      }

      let photoPath = "";
      if (req.file) {
        photoPath = "uploads/" + req.file.filename;
      }

      try {
        await getPool().execute(
          "INSERT INTO students (name, roll, class, section, mobile_number, image_url) VALUES (?, ?, ?, ?, ?, ?)",
          [name, roll, className, section, phone, photoPath]
        );

        res.status(201).json({
          status: "success",
          message: "Student record has been successfully inserted into the database table!",
          student: {
            name,
            roll,
            class: className,
            section,
            photo: photoPath || "No Photo Uploaded",
          },
        });
      } catch (e) {
        console.error("Database error:", e);
        res.status(500).json({ status: "error", message: "Failed to insert student into database." });
      }
    });
  };
  app.post("/insert.php", insertStudentHandler);
  app.post("/php_backend/insert.php", insertStudentHandler);
  app.post("/public/php_backend/insert.php", insertStudentHandler);
  app.post("/save_student.php", insertStudentHandler);

  // 5. Get Students List (get_students.php)
  const getStudentsHandler = (req: Request, res: Response) => {
    const db = getDb();
    const classFilter = req.query.class as string;
    const sectionFilter = req.query.section as string;
    const searchFilter = req.query.search as string;

    let filtered = [...db.students];

    if (classFilter) {
      filtered = filtered.filter((s) => s.class.toLowerCase() === classFilter.toLowerCase());
    }
    if (sectionFilter) {
      filtered = filtered.filter((s) => s.section.toLowerCase() === sectionFilter.toLowerCase());
    }
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.roll.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q)
      );
    }

    res.json({
      status: "success",
      count: filtered.length,
      students: filtered,
    });
  };
  app.get("/get_students.php", getStudentsHandler);
  app.get("/php_backend/get_students.php", getStudentsHandler);
  app.get("/public/php_backend/get_students.php", getStudentsHandler);

  // 6. Student Login (login.php)
  const loginHandler = (req: Request, res: Response) => {
    const db = getDb();
    const body = req.body;

    const username = body.username ? body.username.trim() : "";
    const password = body.password ? body.password.trim() : "";
    const className = body.class ? body.class.trim() : "";
    const roll = body.roll ? body.roll.trim() : "";
    const phone = body.phone ? body.phone.trim() : "";

    if (username) {
      const cleanUser = username.toLowerCase();
      const cleanPass = password.toLowerCase();

      if (cleanUser === "admin" && (cleanPass === "admin" || cleanPass === "admin123")) {
        return res.json({
          status: "success",
          role: "admin",
          message: "Admin successfully authenticated!",
          user: { name: "Administrator", username: "admin", role: "admin" },
        });
      } else if (cleanUser === "teacher" && (cleanPass === "teacher" || cleanPass === "teacher123")) {
        return res.json({
          status: "success",
          role: "teacher",
          message: "Teacher successfully authenticated!",
          user: { name: "Teacher Panel", username: "teacher", role: "teacher" },
        });
      } else if ((cleanUser === "guardian" || cleanUser === "student") && (cleanPass === "guardian" || cleanPass === "student" || cleanPass === "guardian123")) {
        return res.json({
          status: "success",
          role: "student",
          message: "Guardian / Student successfully authenticated!",
          user: { name: "Guardian Portal", username: "guardian", role: "student" },
        });
      } else if (cleanUser === "accountant" && (cleanPass === "accountant" || cleanPass === "accountant123")) {
        return res.json({
          status: "success",
          role: "accountant",
          message: "Accountant successfully authenticated!",
          user: { name: "Accounts Department", username: "accountant", role: "accountant" },
        });
      } else if (cleanUser === "superadmin" && (cleanPass === "superadmin" || cleanPass === "superadmin123")) {
        return res.json({
          status: "success",
          role: "superadmin",
          message: "Super Admin successfully authenticated!",
          user: { name: "Super Administrator", username: "superadmin", role: "superadmin" },
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: `Authentication failed: Invalid credentials provided for ${username}.`,
        });
      }
    }

    // Student Check
    if (className && roll && phone) {
      const student = db.students.find(
        (s) =>
          s.class.toLowerCase() === className.toLowerCase() &&
          s.roll === roll &&
          s.phone === phone
      );

      if (student) {
        return res.json({
          status: "success",
          role: "student",
          message: "Student successfully authenticated!",
          student: {
            sl: student.sl,
            roll: student.roll,
            name: student.name,
            class: student.class,
            section: student.section,
            photo: student.photo,
          },
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "Authentication failed: Invalid Class, Roll, or Phone Number combinations.",
        });
      }
    }

    res.status(400).json({
      status: "error",
      message: "Bad Request: Please provide admin or student login details.",
    });
  };
  app.post("/login.php", loginHandler);
  app.post("/php_backend/login.php", loginHandler);
  app.post("/public/php_backend/login.php", loginHandler);

  // 7. Reset Student Password/Phone (reset_password.php)
  const resetPasswordHandler = (req: Request, res: Response) => {
    const db = getDb();
    const body = req.body;

    const roll = body.roll ? body.roll.trim() : "";
    const className = body.class ? body.class.trim() : "";
    const phone = body.phone ? body.phone.trim() : "";
    const newPhone = body.new_phone ? body.new_phone.trim() : "";

    if (!roll || !className || !phone) {
      return res.status(400).json({
        status: "error",
        message: "Validation Failed: Roll, Class, and Current Phone are required.",
      });
    }

    const studentIndex = db.students.findIndex(
      (s) =>
        s.class.toLowerCase() === className.toLowerCase() &&
        s.roll === roll &&
        s.phone === phone
    );

    if (studentIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Verification failed: Student record matching these details was not found.",
      });
    }

    if (!newPhone) {
      return res.json({
        status: "success",
        message: "Student identity verified successfully.",
        student: {
          name: db.students[studentIndex].name,
        },
      });
    }

    db.students[studentIndex].phone = newPhone;
    saveDb(db);

    res.json({
      status: "success",
      message: "Student phone contact details successfully updated in the database!",
    });
  };
  app.post("/reset_password.php", resetPasswordHandler);
  app.post("/php_backend/reset_password.php", resetPasswordHandler);
  app.post("/public/php_backend/reset_password.php", resetPasswordHandler);


  // 8. Save Seat Plan (save_seat_plan.php)
  const saveSeatPlanHandler = (req: Request, res: Response) => {
    const db = getDb();
    const { examTerm, class: className, section, roomNumber, layoutType } = req.body;

    const studentsInClass = db.students.filter(
      (s) => s.class.toLowerCase() === className.toLowerCase() && s.section === section
    );

    if (studentsInClass.length === 0) {
      return res.status(404).json({ status: "error", message: "No students found for this class and section" });
    }

    const assignedStudents = studentsInClass.map((s, i) => ({
      studentId: s.sl,
      rollNo: s.roll,
      rowNumber: Math.floor(i / 2) + 1,
      columnNumber: (i % 2) + 1,
    }));

    const newPlan: ExamSeatPlan = {
      id: Date.now(),
      examTerm,
      class: className,
      section,
      roomNumber,
      layoutType,
      students: assignedStudents,
      createdAt: new Date().toISOString(),
    };

    db.examSeatPlans.push(newPlan);
    saveDb(db);

    res.json({
      status: "success",
      message: "Seat plan generated and saved successfully!",
      plan: newPlan,
    });
  };
  app.post("/save_seat_plan.php", saveSeatPlanHandler);
  app.post("/php_backend/save_seat_plan.php", saveSeatPlanHandler);
  app.post("/public/php_backend/save_seat_plan.php", saveSeatPlanHandler);

  // 9. Get Student Report (get_report.php / API)
  const getStudentReportHandler = (req: Request, res: Response) => {
    const db = getDb();
    const studentId = parseInt(req.params.studentId, 10);
    const student = db.students.find((s) => s.sl === studentId);
    
    if (!student) {
        return res.status(404).json({ status: "error", message: "Student not found" });
    }

    const record = db.studentRecords.find((r) => r.sl === studentId);
    
    // If no record, return student info + default empty report
    res.json({
      status: "success",
      student,
      report: record || { attendance: null, marks: [], remarks: "" }
    });
  };
  app.get("/api/student-report/:studentId", getStudentReportHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
