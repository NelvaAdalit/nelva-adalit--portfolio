/* ==========================================================================
   NELVA ADALIT PORTFOLIO - LOGIC & INTERACTION (WITH SUPABASE DB & STORAGE)
   Contains: Supabase DB & Storage CRUD, Admin Auth, Lightbox, Mobile menu
   ========================================================================== */

// --- Seed Data (Default Projects) ---
const DEFAULT_PROJECTS = [
  {
    id: "seed-web-1",
    title: "Portal Académico E-Learning",
    category: "web",
    image: "/images/project-web-1.jpg",
    description: "Plataforma interactiva con autenticación de usuarios, base de datos en tiempo real y paneles dinámicos de administración escolar.",
    techs: "Node.js, Supabase, Vercel",
    codeLink: "https://github.com",
    demoLink: "https://vercel.app"
  },
  {
    id: "seed-web-2",
    title: "API REST e-Commerce",
    category: "web",
    image: "/images/project-web-2.jpg",
    description: "Backend optimizado para comercio electrónico con pasarela de pagos integrada, gestión de stock concurrente y caché en memoria.",
    techs: "Node.js, Render, PostgreSQL",
    codeLink: "https://github.com",
    demoLink: "https://render.com"
  },
  {
    id: "seed-ai-1",
    title: "Clasificador de Patologías CNN",
    category: "ai",
    image: "/images/project-ai-1.jpg",
    description: "Modelo de aprendizaje profundo entrenado con TensorFlow para clasificar radiografías pulmonares con precisión diagnóstica del 94.8%.",
    techs: "Python, TensorFlow, Render",
    codeLink: "https://github.com",
    demoLink: "https://render.com"
  },
  {
    id: "seed-ai-2",
    title: "Asistente Conversacional RAG",
    category: "ai",
    image: "/images/project-ai-2.jpg",
    description: "Agente inteligente conectado a bases de conocimiento mediante generación recuperada (RAG) para soporte técnico de alta precisión.",
    techs: "OpenAI, Node.js, Supabase",
    codeLink: "https://github.com",
    demoLink: "https://vercel.app"
  },
  {
    id: "seed-proc-1",
    title: "Automatización de Selección",
    category: "process",
    image: "/images/project-proc-1.jpg",
    description: "Orquestación completa y optimización del ciclo de contratación de personal en Bizagi Suite bajo el estándar internacional BPMN 2.0.",
    techs: "Bizagi, UML, BPMN 2.0",
    codeLink: "https://github.com",
    demoLink: "https://bizagi.com"
  },
  {
    id: "seed-proc-2",
    title: "Arquitectura de Microservicios",
    category: "process",
    image: "/images/project-proc-2.jpg",
    description: "Modelado integral en UML detallando casos de uso, secuencia, clases y topología de despliegue para una fintech transaccional.",
    techs: "UML, Ent. Architect, Secuencia",
    codeLink: "https://github.com",
    demoLink: "https://lucid.app"
  }
];

// --- Seed Data (Default Certifications) ---
const DEFAULT_CERTIFICATIONS = [
  {
    id: "seed-cert-1",
    title: "Desarrollador Frontend Certificado",
    issuer: "Vercel & Meta Academy",
    category: "Frontend",
    description: "Esta credencial valida el dominio avanzado de HTML5, CSS3 responsivo, variables CSS, optimización de velocidad de carga en empaquetadores modernos (Vite/Webpack) y arquitectura de componentes limpios y reutilizables.",
    credentialId: "ID: VRC-998811",
    verifyLink: "https://vercel.com",
    image: "/images/award-4.jpg"
  },
  {
    id: "seed-cert-2",
    title: "Deep Learning Specialist",
    issuer: "DeepLearning.AI",
    category: "Inteligencia Artificial",
    description: "Especialización en redes neuronales convolucionales (CNN) y redes recurrentes (RNN). Desarrollo y ajuste de hiperparámetros en TensorFlow para visión artificial y clasificación médica automatizada.",
    credentialId: "ID: DLAI-77224",
    verifyLink: "https://coursera.org",
    image: "/images/award-2.jpg"
  },
  {
    id: "seed-cert-3",
    title: "BPMN 2.0 Process Modeling",
    issuer: "Bizagi Corporate",
    category: "Bizagi & UML",
    description: "Certificación oficial en el diseño, modelado, simulación y automatización de flujos de trabajo corporativos complejos bajo el estándar BPMN 2.0 y diagramación de casos de uso y despliegue estructurados en UML.",
    credentialId: "ID: BZG-33990",
    verifyLink: "https://bizagi.com",
    image: "/images/award-3.jpg"
  }
];

function normalizeProjectRecord(project) {
  if (!project) return project;

  return {
    id: project.id,
    title: project.title ?? '',
    category: project.category ?? 'web',
    image: project.image ?? '',
    description: project.description ?? '',
    techs: project.techs ?? '',
    codeLink: project.codeLink ?? project.codelink ?? '',
    demoLink: project.demoLink ?? project.demolink ?? ''
  };
}

function normalizeCertificationRecord(certification) {
  if (!certification) return certification;

  return {
    id: certification.id,
    title: certification.title ?? '',
    issuer: certification.issuer ?? '',
    category: certification.category ?? '',
    description: certification.description ?? '',
    credentialId: certification.credentialId ?? certification.credentialid ?? '',
    verifyLink: certification.verifyLink ?? certification.verifylink ?? '',
    image: certification.image ?? ''
  };
}

// --- Global App State ---
let supabaseClient = null;
let isAdminMode = false;
let currentFilter = 'all';
let inMemoryProjects = [...DEFAULT_PROJECTS];
let inMemoryCerts = [...DEFAULT_CERTIFICATIONS];

// --- Initialization Wrapper ---
const init = () => {
  // 1. Initialize Supabase
  initSupabase();

  // 2. Setup Components & Events (Synchronously to prevent UI block)
  const steps = [
    { name: "Project Filters", fn: initProjectFilters },
    { name: "Mobile Menu", fn: initMobileMenu },
    { name: "Admin Mode Toggles", fn: initAdminModeToggle },
    { name: "Auth Forms", fn: initAuthForm },
    { name: "Project Form CRUD", fn: initProjectForm },
    { name: "Certificate Form CRUD", fn: initCertificateForm },
    { name: "File Upload Previews", fn: initFileUploadPreviews },
    { name: "Scroll Effects", fn: initScrollEffects },
    { name: "Scroll Reveal", fn: initScrollReveal },
    { name: "Contact Form", fn: initContactForm }
  ];

  steps.forEach(step => {
    try {
      step.fn();
    } catch (error) {
      console.error(`[App Error] Fail initializing component: ${step.name}`, error);
    }
  });

  // 3. Load Data & Render asynchronously in the background
  loadDataAndRender();

  // Render icons
  try {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (e) {
    console.error("Lucide load error", e);
  }
};

// Check readyState for modules
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * Loads DB session and renders components in the background
 */
async function loadDataAndRender() {
  try {
    await checkAuthSession();
  } catch (e) {
    console.warn("Auth check failed", e);
  }

  try {
    await renderProjects();
  } catch (e) {
    console.error("Projects grid render failed", e);
  }

  try {
    await renderCertifications();
  } catch (e) {
    console.error("Certifications grid render failed", e);
  }
}

// ==========================================================================
// 1. SUPABASE CLIENT & AUTHENTICATION SESSIONS
// ==========================================================================

function initSupabase() {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && typeof supabase !== 'undefined') {
      supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
    } else {
      console.warn("Supabase credentials missing in .env or SDK not loaded. Running in local fallback.");
    }
  } catch (e) {
    console.error("Error initializing Supabase client", e);
  }
}

async function checkAuthSession() {
  if (!supabaseClient) return;
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;

    if (session) {
      isAdminMode = true;
      updateAdminUI(true);
    }
  } catch (e) {
    console.warn("Could not check active admin session", e);
  }
}

function updateAdminUI(loggedIn) {
  const toggleBtn = document.getElementById('admin-toggle');
  const toggleText = document.getElementById('admin-toggle-text');
  const projGrid = document.getElementById('projects-grid');
  const certGrid = document.getElementById('certs-grid');

  if (!toggleBtn) return;

  if (loggedIn) {
    toggleBtn.classList.add('active');
    if (toggleText) toggleText.textContent = 'Salir Editor';
    const icon = toggleBtn.querySelector('i');
    if (icon) icon.setAttribute('data-lucide', 'lock-open');
    if (projGrid) projGrid.classList.add('admin-mode-active');
    if (certGrid) certGrid.classList.add('admin-mode-active');
  } else {
    toggleBtn.classList.remove('active');
    if (toggleText) toggleText.textContent = 'Modo Editor';
    const icon = toggleBtn.querySelector('i');
    if (icon) icon.setAttribute('data-lucide', 'lock');
    if (projGrid) projGrid.classList.remove('admin-mode-active');
    if (certGrid) certGrid.classList.remove('admin-mode-active');
  }

  if (typeof lucide !== 'undefined') {
    try { lucide.createIcons(); } catch (e) {}
  }
}

// ==========================================================================
// 2. SUPABASE FILE STORAGE (UPLOADS BUCKET)
// ==========================================================================

async function uploadFileToStorage(file, folder = 'projects') {
  if (!supabaseClient) {
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabaseClient.storage
      .from('portfolio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseClient.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error("Storage upload error details", err);
    throw new Error("No se pudo subir la imagen a Supabase Storage: " + err.message);
  }
}

function initFileUploadPreviews() {
  const setupPreview = (fileInputId, imgId, containerId, hiddenInputId) => {
    const fileInput = document.getElementById(fileInputId);
    const previewImg = document.getElementById(imgId);
    const container = document.getElementById(containerId);
    const hiddenInput = document.getElementById(hiddenInputId);

    if (!fileInput || !previewImg || !container) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          previewImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ff4a5a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><text x="5" y="16" fill="%23ff4a5a" font-size="4.5" font-family="sans-serif" font-weight="bold">PDF</text></svg>`;
          container.style.display = 'block';
          if (hiddenInput) hiddenInput.value = "PENDING_FILE_UPLOAD";
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewImg.src = event.target.result;
            container.style.display = 'block';
            if (hiddenInput) {
              hiddenInput.value = "PENDING_FILE_UPLOAD";
            }
          };
          reader.readAsDataURL(file);
        }
      } else {
        container.style.display = 'none';
        if (hiddenInput) hiddenInput.value = '';
      }
    });
  };

  setupPreview('proj-image-file', 'proj-image-preview', 'proj-image-preview-container', 'proj-image');
  setupPreview('cert-image-file', 'cert-image-preview', 'cert-image-preview-container', 'cert-image');
}

// ==========================================================================
// 3. PROJECT DATABASE READS & RENDERING
// ==========================================================================

async function getProjects() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(normalizeProjectRecord);
      }
      return DEFAULT_PROJECTS;
    } catch (e) {
      console.warn("Supabase projects fetch failed. Falling back to local data.", e);
    }
  }

  try {
    const localData = localStorage.getItem('nelva_projects');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeProjectRecord);
    }
  } catch (err) {}

  return inMemoryProjects.map(normalizeProjectRecord);
}

async function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="section-padding text-center" style="grid-column: 1/-1;"><i data-lucide="loader-2" class="animate-spin text-accent" style="width:32px;height:32px;"></i><p style="margin-top:12px;color:var(--text-secondary);">Cargando proyectos...</p></div>';
  if (typeof lucide !== 'undefined') lucide.createIcons();

  let projects = [];
  try {
    projects = await getProjects();
  } catch (e) {
    projects = DEFAULT_PROJECTS;
  }

  grid.innerHTML = '';

  const filteredProjects = projects.filter(proj => {
    if (!proj) return false;
    const cat = proj.category || 'web';
    return currentFilter === 'all' || cat === currentFilter;
  });

  if (isAdminMode) {
    const addCard = document.createElement('article');
    addCard.className = 'add-project-card';
    addCard.id = 'add-project-btn';
    addCard.innerHTML = `
      <div class="add-project-content">
        <div class="add-icon-box">
          <i data-lucide="plus"></i>
        </div>
        <span class="add-project-text">Agregar Proyecto</span>
      </div>
    `;
    grid.appendChild(addCard);
    addCard.addEventListener('click', () => openProjectModal());
  }

  filteredProjects.forEach(proj => {
    try {
      const card = document.createElement('article');
      card.className = 'project-card show';
      card.setAttribute('data-category', proj.category || 'web');
      card.setAttribute('data-id', proj.id);
      
      const title = proj.title || 'Proyecto sin título';
      const desc = proj.description || '';
      const image = proj.image || '/images/project-web-1.jpg';
      const techsStr = proj.techs || '';
      const codeLink = proj.codeLink || '#';
      const demoLink = proj.demoLink || '#';
      const categoryLabel = getCategoryName(proj.category);

      card.innerHTML = `
        <div class="project-admin-actions" style="${isAdminMode ? 'opacity:1; pointer-events:auto; transform:translateY(0);' : ''}">
          <button class="proj-admin-btn proj-btn-edit" data-id="${proj.id}" title="Editar Proyecto">
            <i data-lucide="pencil"></i>
          </button>
          <button class="proj-admin-btn proj-btn-delete" data-id="${proj.id}" title="Eliminar Proyecto">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        
        <div class="project-img-wrapper">
          <div class="project-glow"></div>
          <img src="${image}" alt="${title}" class="project-img" loading="lazy">
          <span class="project-category-badge">${categoryLabel}</span>
        </div>
        
        <div class="project-info">
          <h3 class="project-title">${title}</h3>
          <p class="project-desc">${desc}</p>
          
          <div class="project-tech-tags">
            ${techsStr ? techsStr.split(',').map(tech => {
              const trimmedTech = tech.trim();
              if (!trimmedTech) return '';
              return `
                <span class="tech-tag" title="${trimmedTech}">
                  <i data-lucide="${getTechIcon(trimmedTech)}" class="tech-icon"></i> ${trimmedTech}
                </span>
              `;
            }).join('') : ''}
          </div>
          
          <div class="project-links">
            <a href="${codeLink}" target="_blank" rel="noopener noreferrer" class="btn-project-link btn-code">
              <i data-lucide="${proj.category === 'process' ? 'folder' : 'github'}"></i> ${proj.category === 'process' ? 'Planos' : 'Código'}
            </a>
            <a href="${demoLink}" target="_blank" rel="noopener noreferrer" class="btn-project-link btn-demo">
              <i data-lucide="${proj.category === 'process' ? 'eye' : 'external-link'}"></i> ${proj.category === 'process' ? 'Modelado' : 'Demo'}
            </a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    } catch (err) {
      console.error(err);
    }
  });

  if (typeof lucide !== 'undefined') {
    try { lucide.createIcons(); } catch (e) {}
  }

  attachCardAdminListeners();
}

function attachCardAdminListeners() {
  const editButtons = document.querySelectorAll('.proj-btn-edit');
  const deleteButtons = document.querySelectorAll('.proj-btn-delete');

  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProjectModal(btn.getAttribute('data-id'));
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteProject(btn.getAttribute('data-id'));
    });
  });
}

// ==========================================================================
// 4. CERTIFICATION DATABASE READS & RENDERING
// ==========================================================================

async function getCertifications() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('certificaciones')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(normalizeCertificationRecord);
      }
      return DEFAULT_CERTIFICATIONS;
    } catch (e) {
      console.warn("Supabase certs fetch failed. Falling back to local data.", e);
    }
  }

  try {
    const localData = localStorage.getItem('nelva_certs');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeCertificationRecord);
    }
  } catch (err) {}

  return inMemoryCerts.map(normalizeCertificationRecord);
}

async function renderCertifications() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="section-padding text-center" style="grid-column: 1/-1;"><i data-lucide="loader-2" class="animate-spin text-accent" style="width:32px;height:32px;"></i><p style="margin-top:12px;color:var(--text-secondary);">Cargando certificaciones...</p></div>';
  if (typeof lucide !== 'undefined') lucide.createIcons();

  let certs = [];
  try {
    certs = await getCertifications();
  } catch (e) {
    certs = DEFAULT_CERTIFICATIONS;
  }

  grid.innerHTML = '';

  if (isAdminMode) {
    const addCard = document.createElement('article');
    addCard.className = 'add-project-card';
    addCard.id = 'add-cert-btn';
    addCard.innerHTML = `
      <div class="add-project-content">
        <div class="add-icon-box">
          <i data-lucide="plus"></i>
        </div>
        <span class="add-project-text">Agregar Certificado</span>
      </div>
    `;
    grid.appendChild(addCard);
    addCard.addEventListener('click', () => openCertModal());
  }

  certs.forEach(cert => {
    try {
      const card = document.createElement('article');
      card.className = 'project-card show';
      card.setAttribute('data-id', cert.id);
      
      const title = cert.title || 'Certificado';
      const issuer = cert.issuer || '';
      const description = cert.description || '';
      const credentialId = cert.credentialId || '';
      const verifyLink = cert.verifyLink || '#';
      const image = cert.image || '/images/award-4.jpg';
      const category = cert.category || 'Credencial';

      // Imagen o plantilla SVG si el certificado es un archivo PDF
      const isPdf = image.toLowerCase().endsWith('.pdf') || image.includes('application/pdf');
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="none"><rect width="400" height="250" fill="#1a2333"/><rect x="150" y="50" width="100" height="120" rx="8" fill="#1f293d" stroke="#ff4a5a" stroke-width="3"/><polyline points="210 50 210 90 250 90" fill="none" stroke="#ff4a5a" stroke-width="3"/><text x="200" y="210" fill="#ffffff" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">DOCUMENTO PDF</text><path d="M175 110 H225 M175 130 H225 M175 150 H200" stroke="#ff4a5a" stroke-width="2" stroke-linecap="round"/></svg>`;
      const certImg = isPdf 
        ? `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`
        : image;

      card.innerHTML = `
        <div class="project-admin-actions" style="${isAdminMode ? 'opacity:1; pointer-events:auto; transform:translateY(0);' : ''}">
          <button class="proj-admin-btn cert-btn-edit" data-id="${cert.id}" title="Editar Certificado">
            <i data-lucide="pencil"></i>
          </button>
          <button class="proj-admin-btn cert-btn-delete" data-id="${cert.id}" title="Eliminar Certificado">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        
        <div class="project-img-wrapper">
          <div class="project-glow"></div>
          <img src="${certImg}" alt="${title}" class="project-img" loading="lazy">
          <span class="project-category-badge">${category}</span>
        </div>
        
        <div class="project-info">
          <h3 class="project-title">${title}</h3>
          <p class="project-desc" style="color:var(--text-secondary); margin-bottom:6px;"><strong>Emisor:</strong> ${issuer}</p>
          <p class="project-desc">${description}</p>
          

          
          <div class="project-links">
            <a href="${image}" target="_blank" rel="noopener noreferrer" class="btn-project-link btn-code">
              <i data-lucide="file-text"></i> Ver Documento
            </a>
            ${verifyLink && verifyLink !== '#' ? `
              <a href="${verifyLink}" target="_blank" rel="noopener noreferrer" class="btn-project-link btn-demo">
                <i data-lucide="external-link"></i> Verificar
              </a>
            ` : ''}
          </div>
        </div>
      `;
      grid.appendChild(card);
    } catch (err) {
      console.error("Error creating certificate card", cert, err);
    }
  });

  if (typeof lucide !== 'undefined') {
    try { lucide.createIcons(); } catch (e) {}
  }

  attachCertAdminListeners();
}

function attachCertAdminListeners() {
  const editButtons = document.querySelectorAll('.cert-btn-edit');
  const deleteButtons = document.querySelectorAll('.cert-btn-delete');

  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCertModal(btn.getAttribute('data-id'));
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCert(btn.getAttribute('data-id'));
    });
  });
}

function getCertIcon(category) {
  if (!category) return 'award';
  const c = category.toLowerCase();
  if (c.includes('front') || c.includes('web') || c.includes('react')) return 'award';
  if (c.includes('inteligencia') || c.includes('ia') || c.includes('ai') || c.includes('learning')) return 'brain-circuit';
  if (c.includes('bizagi') || c.includes('bpmn') || c.includes('process') || c.includes('uml')) return 'file-symlink';
  return 'award';
}

function getCategoryName(cat) {
  switch (cat) {
    case 'web': return 'Desarrollo Web';
    case 'ai': return 'Inteligencia Artificial';
    case 'process': return 'Bizagi & UML';
    default: return cat || 'Desarrollo';
  }
}

function getTechIcon(tech) {
  if (!tech) return 'code';
  const t = tech.toLowerCase();
  if (t.includes('node')) return 'server';
  if (t.includes('supabase') || t.includes('database') || t.includes('postgres') || t.includes('sql')) return 'database';
  if (t.includes('vercel')) return 'triangle';
  if (t.includes('render') || t.includes('cloud') || t.includes('docker')) return 'cloud';
  if (t.includes('python') || t.includes('tensorflow') || t.includes('cpu') || t.includes('inteligencia') || t.includes('ia') || t.includes('ai')) return 'cpu';
  if (t.includes('openai') || t.includes('gpt') || t.includes('rag') || t.includes('chatbot') || t.includes('conversacional')) return 'sparkles';
  if (t.includes('bizagi') || t.includes('bpmn') || t.includes('git')) return 'git-branch';
  if (t.includes('uml') || t.includes('architect') || t.includes('secuencia')) return 'file-json';
  return 'code';
}

// ==========================================================================
// 5. SEEDING REMOTE DATA
// ==========================================================================

async function seedSupabaseDataIfEmpty() {
  if (!supabaseClient) return;
  try {
    const { data: projData } = await supabaseClient.from('proyectos').select('id').limit(1);
    if (projData && projData.length === 0) {
      await supabaseClient.from('proyectos').insert(DEFAULT_PROJECTS.map(project => ({
        id: project.id,
        title: project.title,
        category: project.category,
        image: project.image,
        description: project.description,
        techs: project.techs,
        codelink: project.codeLink,
        demolink: project.demoLink
      })));
      console.log("Seeded default projects to Supabase.");
    }

    const { data: certData } = await supabaseClient.from('certificaciones').select('id').limit(1);
    if (certData && certData.length === 0) {
      await supabaseClient.from('certificaciones').insert(DEFAULT_CERTIFICATIONS.map(certification => ({
        id: certification.id,
        title: certification.title,
        issuer: certification.issuer,
        category: certification.category,
        description: certification.description,
        credentialid: certification.credentialId,
        verifylink: certification.verifyLink,
        image: certification.image
      })));
      console.log("Seeded default certifications to Supabase.");
    }
  } catch (e) {
    console.error("Error auto-seeding tables", e);
  }
}

// ==========================================================================
// 6. ADMIN AUTHENTICATION
// ==========================================================================

function initAdminModeToggle() {
  const toggleBtn = document.getElementById('admin-toggle');
  const loginModal = document.getElementById('login-modal');

  // Registrar el manejador de forma global para el onclick inline de respaldo
  window.handleAdminToggleClick = async () => {
    if (!supabaseClient) {
      isAdminMode = !isAdminMode;
      updateAdminUI(isAdminMode);
      await renderProjects();
      await renderCertifications();
      return;
    }

    if (isAdminMode) {
      if (confirm('¿Deseas cerrar sesión de Administrador?')) {
        try {
          const { error } = await supabaseClient.auth.signOut();
          if (error) throw error;
          
          isAdminMode = false;
          updateAdminUI(false);
          await renderProjects();
          await renderCertifications();
        } catch (e) {
          alert('Error al cerrar sesión: ' + e.message);
        }
      }
    } else {
      if (loginModal) {
        loginModal.style.display = 'flex';
        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.focus();
      }
    }
  };

  if (!toggleBtn) return;

  // Si el script cargó con éxito, limpiamos el onclick inline de respaldo para evitar ejecuciones dobles
  toggleBtn.removeAttribute('onclick');
  toggleBtn.addEventListener('click', window.handleAdminToggleClick);

  const closeBtn = document.getElementById('close-login-modal');
  if (closeBtn && loginModal) {
    closeBtn.onclick = () => { loginModal.style.display = 'none'; };
    loginModal.onclick = (e) => {
      if (e.target === loginModal) loginModal.style.display = 'none';
    };
  }
}

function initAuthForm() {
  const form = document.getElementById('login-form');
  const feedback = document.getElementById('login-feedback');
  const loginModal = document.getElementById('login-modal');
  const submitBtn = document.getElementById('btn-login-submit');

  if (!form || !loginModal) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (feedback) {
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
    }

    if (!supabaseClient) {
      if (feedback) {
        feedback.textContent = "Supabase no está conectado localmente. Revisa el archivo .env";
        feedback.classList.add('error');
        feedback.style.display = 'block';
      }
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Ingresando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;

      isAdminMode = true;
      updateAdminUI(true);
      loginModal.style.display = 'none';
      form.reset();

      await seedSupabaseDataIfEmpty();

      await renderProjects();
      await renderCertifications();
    } catch (err) {
      if (feedback) {
        feedback.textContent = `Error: ${err.message || 'Credenciales incorrectas'}`;
        feedback.classList.add('error');
        feedback.style.display = 'block';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  });
}

// ==========================================================================
// 7. PROJECTS CRUD WRITE OPERATIONS
// ==========================================================================

async function openProjectModal(id = null) {
  const modal = document.getElementById('project-modal');
  const form = document.getElementById('project-form');
  const modalTitle = document.getElementById('modal-title');
  const closeBtn = document.getElementById('close-project-modal');
  const previewContainer = document.getElementById('proj-image-preview-container');

  if (!modal || !form || !modalTitle) return;

  form.reset();
  if (previewContainer) previewContainer.style.display = 'none';
  
  const idInput = document.getElementById('project-id');
  if (idInput) idInput.value = '';

  if (id) {
    modalTitle.textContent = 'Editar Proyecto';
    let projects = await getProjects();
    const proj = projects.find(p => p.id === id);
    
    if (proj) {
      if (idInput) idInput.value = proj.id || '';
      const t = document.getElementById('proj-title');
      const cat = document.getElementById('proj-category');
      const img = document.getElementById('proj-image');
      const desc = document.getElementById('proj-desc');
      const techs = document.getElementById('proj-techs');
      const code = document.getElementById('proj-code');
      const demo = document.getElementById('proj-demo');

      if (t) t.value = proj.title || '';
      if (cat) cat.value = proj.category || 'web';
      if (img) img.value = proj.image || '';
      if (desc) desc.value = proj.description || '';
      if (techs) techs.value = proj.techs || '';
      if (code) code.value = proj.codeLink || '';
      if (demo) demo.value = proj.demoLink || '';

      if (proj.image && previewContainer) {
        const previewImg = document.getElementById('proj-image-preview');
        if (previewImg) {
          previewImg.src = proj.image;
          previewContainer.style.display = 'block';
        }
      }
    }
  } else {
    modalTitle.textContent = 'Agregar Proyecto';
  }

  modal.style.display = 'flex';
  const closeModal = () => { modal.style.display = 'none'; };
  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

function initProjectForm() {
  const form = document.getElementById('project-form');
  const modal = document.getElementById('project-modal');
  const submitBtn = document.getElementById('btn-save-project');

  if (!form || !modal || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('project-id').value;
    const title = document.getElementById('proj-title').value.trim();
    const category = document.getElementById('proj-category').value;
    const description = document.getElementById('proj-desc').value.trim();
    const techs = document.getElementById('proj-techs').value.trim();
    const codeLink = document.getElementById('proj-code').value.trim();
    const demoLink = document.getElementById('proj-demo').value.trim();
    
    const fileInput = document.getElementById('proj-image-file');
    let imageUrl = document.getElementById('proj-image').value;

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Guardando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
      if (fileInput && fileInput.files[0]) {
        imageUrl = await uploadFileToStorage(fileInput.files[0], 'projects');
      }

      if (!imageUrl || imageUrl === 'PENDING_FILE_UPLOAD') {
        throw new Error("Por favor, selecciona una imagen para el proyecto.");
      }

      let success = false;

      if (supabaseClient) {
        if (id) {
          const { error } = await supabaseClient
            .from('proyectos')
            .update({ title, category, image: imageUrl, description, techs, codelink: codeLink, demolink: demoLink })
            .eq('id', id);
          if (error) throw error;
        } else {
          const newProj = {
            id: 'user-proj-' + Date.now(),
            title,
            category,
            image: imageUrl,
            description,
            techs,
            codelink: codeLink,
            demolink: demoLink
          };
          const { error } = await supabaseClient
            .from('proyectos')
            .insert([newProj]);
          if (error) throw error;
        }
        success = true;
      } else {
        let projects = await getProjects();
        if (id) {
          projects = projects.map(p => {
            if (p.id === id) {
              return { id, title, category, image: imageUrl, description, techs, codeLink, demoLink };
            }
            return p;
          });
        } else {
          const newProj = {
            id: 'user-proj-' + Date.now(),
            title,
            category,
            image: imageUrl,
            description,
            techs,
            codeLink,
            demoLink
          };
          projects.push(newProj);
        }
        saveLocalProjects(projects);
        success = true;
      }

      if (success) {
        modal.style.display = 'none';
        await renderProjects();
      }
    } catch (err) {
      alert(err.message || 'Error al guardar el proyecto');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  });
}

function saveLocalProjects(projects) {
  try {
    localStorage.setItem('nelva_projects', JSON.stringify(projects));
  } catch (e) {
    inMemoryProjects = projects;
  }
}

async function deleteProject(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este proyecto del portafolio?')) {
    let success = false;
    
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('proyectos')
          .delete()
          .eq('id', id);
        if (error) throw error;
        success = true;
      } catch (err) {
        alert('Error al borrar: ' + err.message);
      }
    } else {
      try {
        let projects = await getProjects();
        projects = projects.filter(p => p.id !== id);
        saveLocalProjects(projects);
        success = true;
      } catch (err) {
        console.error("Local delete error", err);
      }
    }

    if (success) {
      await renderProjects();
    }
  }
}

// ==========================================================================
// 8. CERTIFICATES CRUD WRITE OPERATIONS
// ==========================================================================

async function openCertModal(id = null) {
  const modal = document.getElementById('cert-modal');
  const form = document.getElementById('cert-form');
  const modalTitle = document.getElementById('cert-modal-title');
  const closeBtn = document.getElementById('close-cert-modal');
  const previewContainer = document.getElementById('cert-image-preview-container');

  if (!modal || !form || !modalTitle) return;

  form.reset();
  if (previewContainer) previewContainer.style.display = 'none';

  const idInput = document.getElementById('cert-id');
  if (idInput) idInput.value = '';

  if (id) {
    modalTitle.textContent = 'Editar Certificación';
    let certs = await getCertifications();
    const cert = certs.find(c => c.id === id);

    if (cert) {
      if (idInput) idInput.value = cert.id || '';
      const t = document.getElementById('cert-title-input');
      const issuer = document.getElementById('cert-issuer-input');
      const cat = document.getElementById('cert-category-input');
      const desc = document.getElementById('cert-desc-input');
      const credId = document.getElementById('cert-credential-input');
      const verify = document.getElementById('cert-verify-input');
      const img = document.getElementById('cert-image');

      if (t) t.value = cert.title || '';
      if (issuer) issuer.value = cert.issuer || '';
      if (cat) cat.value = cert.category || '';
      if (desc) desc.value = cert.description || '';
      if (credId) credId.value = cert.credentialId || '';
      if (verify) verify.value = cert.verifyLink || '';
      if (img) img.value = cert.image || '';

      if (cert.image && previewContainer) {
        const previewImg = document.getElementById('cert-image-preview');
        if (previewImg) {
          previewImg.src = cert.image;
          previewContainer.style.display = 'block';
        }
      }
    }
  } else {
    modalTitle.textContent = 'Agregar Certificación';
  }

  modal.style.display = 'flex';
  const closeModal = () => { modal.style.display = 'none'; };
  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

function initCertificateForm() {
  const form = document.getElementById('cert-form');
  const modal = document.getElementById('cert-modal');
  const submitBtn = document.getElementById('btn-save-cert');

  if (!form || !modal || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('cert-id').value;
    const title = document.getElementById('cert-title-input').value.trim();
    const issuer = document.getElementById('cert-issuer-input').value.trim();
    const category = document.getElementById('cert-category-input').value.trim();
    const description = document.getElementById('cert-desc-input').value.trim();
    const credIdEl = document.getElementById('cert-credential-input');
    const credentialId = credIdEl ? credIdEl.value.trim() : '';
    const verifyLink = document.getElementById('cert-verify-input').value.trim();

    const fileInput = document.getElementById('cert-image-file');
    let imageUrl = document.getElementById('cert-image').value;

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Guardando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
      if (fileInput && fileInput.files[0]) {
        imageUrl = await uploadFileToStorage(fileInput.files[0], 'certs');
      }

      if (!imageUrl || imageUrl === 'PENDING_FILE_UPLOAD') {
        throw new Error("Por favor, selecciona una imagen para el certificado.");
      }

      let success = false;

      if (supabaseClient) {
        if (id) {
          const { error } = await supabaseClient
            .from('certificaciones')
            .update({ title, issuer, category, description, credentialid: credentialId, verifylink: verifyLink, image: imageUrl })
            .eq('id', id);
          if (error) throw error;
        } else {
          const newCert = {
            id: 'user-cert-' + Date.now(),
            title,
            issuer,
            category,
            description,
            credentialid: credentialId,
            verifylink: verifyLink,
            image: imageUrl
          };
          const { error } = await supabaseClient
            .from('certificaciones')
            .insert([newCert]);
          if (error) throw error;
        }
        success = true;
      } else {
        let certs = await getCertifications();
        if (id) {
          certs = certs.map(c => {
            if (c.id === id) {
              return { id, title, issuer, category, description, credentialId, verifyLink, image: imageUrl };
            }
            return c;
          });
        } else {
          const newCert = {
            id: 'user-cert-' + Date.now(),
            title,
            issuer,
            category,
            description,
            credentialId,
            verifyLink,
            image: imageUrl
          };
          certs.push(newCert);
        }
        saveLocalCerts(certs);
        success = true;
      }

      if (success) {
        modal.style.display = 'none';
        await renderCertifications();
      }
    } catch (err) {
      alert(err.message || 'Error al guardar la certificación');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  });
}

function saveLocalCerts(certs) {
  try {
    localStorage.setItem('nelva_certs', JSON.stringify(certs));
  } catch (e) {
    inMemoryCerts = certs;
  }
}

async function deleteCert(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este certificado?')) {
    let success = false;

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('certificaciones')
          .delete()
          .eq('id', id);
        if (error) throw error;
        success = true;
      } catch (err) {
        alert('Error al borrar de Supabase: ' + err.message);
      }
    } else {
      try {
        let certs = await getCertifications();
        certs = certs.filter(c => c.id !== id);
        saveLocalCerts(certs);
        success = true;
      } catch (e) {
        console.error(e);
      }
    }

    if (success) {
      await renderCertifications();
    }
  }
}



// ==========================================================================
// 10. BASE SITE FEATURES (MOBILE NAV, SCROLL EFFECTS, FORM MOCKS)
// ==========================================================================

function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter') || 'all';
      await renderProjects();
    });
  });
}

function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    navMenu.classList.toggle('open');
    mobileToggle.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', !isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initScrollEffects() {
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (header) {
    const handleScrollStyles = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScrollStyles);
    handleScrollStyles();
  }

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -45% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          if (activeId) {
            navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
              }
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => {
      if (section.getAttribute('id')) {
        observer.observe(section);
      }
    });
  }
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.05
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('btn-submit-contact');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enviando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    feedback.style.display = 'none';
    feedback.className = 'form-feedback';

    setTimeout(() => {
      const nameEl = document.getElementById('contact-name');
      const emailEl = document.getElementById('contact-email');
      
      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';

      if (name && email) {
        feedback.textContent = `¡Gracias, ${name}! Tu mensaje ha sido enviado exitosamente. Nos contactaremos al correo: ${email}.`;
        feedback.classList.add('success');
        feedback.style.display = 'block';
        form.reset();
      } else {
        feedback.textContent = 'Hubo un error al procesar el formulario. Por favor, revisa todos los campos.';
        feedback.classList.add('error');
        feedback.style.display = 'block';
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      if (feedback.classList.contains('success')) {
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 7000);
      }
    }, 1500);
  });
}
