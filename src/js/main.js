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

const DEFAULT_AWARDS = [
  {
    id: "award-1",
    title: "Hackathon de Innovación",
    tag: "Primer Lugar",
    description: "Solución IA aplicada a la sustentabilidad regional.",
    image: "/images/award-1.jpg"
  },
  {
    id: "award-2",
    title: "Excelencia Universitaria",
    tag: "Académico",
    description: "Reconocimiento al promedio sobresaliente.",
    image: "/images/award-2.jpg"
  },
  {
    id: "award-3",
    title: "Disciplina Militar",
    tag: "Honorífico",
    description: "Mención al valor y cumplimiento ejemplar.",
    image: "/images/award-3.jpg"
  },
  {
    id: "award-4",
    title: "Certificación C1 Advanced",
    tag: "Idiomas",
    description: "Nivel lingüístico superior avalado internacionalmente.",
    image: "/images/award-4.jpg"
  }
];

function normalizeAwardRecord(award) {
  if (!award) return award;
  return {
    id: award.id,
    title: award.title ?? '',
    tag: award.tag ?? '',
    description: award.description ?? '',
    image: award.image ?? ''
  };
}

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

function getShortDescription(text, limit = 110) {
  if (!text) return '';
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

function buildCertificationImage(image) {
  const source = image || '/images/award-4.jpg';
  const isPdf = source.toLowerCase().endsWith('.pdf') || source.includes('application/pdf');

  if (!isPdf) return source;

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="none"><rect width="400" height="250" fill="#1a2333"/><rect x="150" y="50" width="100" height="120" rx="8" fill="#1f293d" stroke="#ff4a5a" stroke-width="3"/><polyline points="210 50 210 90 250 90" fill="none" stroke="#ff4a5a" stroke-width="3"/><text x="200" y="210" fill="#ffffff" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">DOCUMENTO PDF</text><path d="M175 110 H225 M175 130 H225 M175 150 H200" stroke="#ff4a5a" stroke-width="2" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

function hasValidExternalUrl(value) {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function initCertificationDetailModal() {
  const modal = document.getElementById('cert-detail-modal');
  const closeBtn = document.getElementById('close-cert-detail-modal');

  if (!modal) return;

  const closeModal = () => {
    modal.style.display = 'none';
  };

  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
}

function openCertificationDetailModal(cert) {
  const modal = document.getElementById('cert-detail-modal');
  if (!modal || !cert) return;

  const title = cert.title || 'Certificado';
  const issuer = cert.issuer || '';
  const description = cert.description || '';
  const credentialId = cert.credentialId || '';
  const verifyLink = cert.verifyLink || '';
  const image = buildCertificationImage(cert.image);
  const category = cert.category || 'Credencial';

  const imgEl = document.getElementById('cert-detail-img');
  const tagEl = document.getElementById('cert-detail-tag');
  const titleEl = document.getElementById('cert-detail-title');
  const issuerEl = document.getElementById('cert-detail-issuer');
  const descEl = document.getElementById('cert-detail-desc-text');
  const idEl = document.getElementById('cert-detail-id');
  const docLink = document.getElementById('cert-detail-doc-link');
  const verifyBtn = document.getElementById('cert-detail-verify-btn');

  if (imgEl) {
    imgEl.src = image;
    imgEl.alt = title;
  }
  if (tagEl) tagEl.textContent = category;
  if (titleEl) titleEl.textContent = title;
  if (issuerEl) issuerEl.textContent = issuer;
  if (descEl) descEl.textContent = description;
  if (idEl) idEl.textContent = credentialId;

  if (docLink) {
    docLink.href = cert.image || '#';
    docLink.style.display = cert.image ? 'inline-flex' : 'none';
  }

  if (verifyBtn) {
    const showVerify = hasValidExternalUrl(verifyLink);
    verifyBtn.href = showVerify ? verifyLink.trim() : '#';
    verifyBtn.style.display = showVerify ? 'inline-flex' : 'none';
  }

  modal.style.display = 'flex';
}

// --- Global App State ---
let supabaseClient = null;
let isAdminMode = false;
let currentFilter = 'all';
let inMemoryProjects = [...DEFAULT_PROJECTS];
let inMemoryCerts = [...DEFAULT_CERTIFICATIONS];
let inMemoryAwards = [...DEFAULT_AWARDS];

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
    { name: "Profile Biography CRUD", fn: initProfileForm },
    { name: "Achievements CRUD", fn: initAwardForm },
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
    await renderProfile();
  } catch (e) {
    console.error("Profile render failed", e);
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

  try {
    await renderAwards();
  } catch (e) {
    console.error("Awards gallery render failed", e);
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
  setupPreview('award-image-file', 'award-image-preview', 'award-image-preview-container', 'award-image');
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

      if (data) {
        return data.map(normalizeProjectRecord);
      }
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
          ${formatDescriptionToggle(desc)}
          
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
  attachDescriptionToggleListeners(grid);
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

      if (data) {
        return data.map(normalizeCertificationRecord);
      }
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

function formatDescriptionToggle(desc) {
  if (!desc) return '';
  const limit = 110;
  if (desc.length <= limit) {
    return `<p class="project-desc">${desc}</p>`;
  }
  
  const truncated = desc.substring(0, limit);
  return `
    <p class="project-desc desc-toggle-container">
      <span class="desc-short">${truncated}... <span class="read-more-btn" style="color:var(--color-accent); cursor:pointer; font-weight:600; font-size:0.8rem; text-decoration:underline;">Ver más</span></span>
      <span class="desc-full" style="display:none;">${desc} <span class="read-less-btn" style="color:var(--color-accent); cursor:pointer; font-weight:600; font-size:0.8rem; text-decoration:underline; margin-left:4px;">Ver menos</span></span>
    </p>
  `;
}

function attachDescriptionToggleListeners(parentContainer) {
  if (!parentContainer) return;
  const containers = parentContainer.querySelectorAll('.desc-toggle-container');
  containers.forEach(container => {
    const shortEl = container.querySelector('.desc-short');
    const fullEl = container.querySelector('.desc-full');
    const moreBtn = container.querySelector('.read-more-btn');
    const lessBtn = container.querySelector('.read-less-btn');

    if (moreBtn && lessBtn && shortEl && fullEl) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.add('expanded');
        shortEl.style.display = 'none';
        fullEl.style.display = 'inline';
      });
      lessBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.remove('expanded');
        shortEl.style.display = 'inline';
        fullEl.style.display = 'none';
      });
    }
  });
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
      const verifyLink = cert.verifyLink || '';
      const image = cert.image || '/images/award-4.jpg';
      const category = cert.category || 'Credencial';
      const certImg = buildCertificationImage(image);
      const showVerifyLink = hasValidExternalUrl(verifyLink);

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
          ${formatDescriptionToggle(description)}
          
          <div class="project-links">
            <a href="${image}" target="_blank" rel="noopener noreferrer" class="btn-project-link btn-code">
              <i data-lucide="file-text"></i> Ver Documento
            </a>
            ${showVerifyLink ? `
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
  attachDescriptionToggleListeners(grid);
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
  // Desactivado para evitar la inserción de datos de prueba en la base de datos
  return;
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
      await renderProfile();
      await renderAwards();
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
          await renderProfile();
          await renderAwards();
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
      await renderProfile();
      await renderAwards();
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
// 8. PROFILE BIOGRAPHY DATABASE READS, RENDERING & WRITES
// ==========================================================================

async function getProfile() {
  const defaultProfile = {
    id: 'main_profile',
    about_subtitle: 'Disciplina, Resiliencia y Enfoque Técnico',
    about_text_1: 'Mi trayectoria profesional está guiada por la firme convicción de que los mejores resultados técnicos nacen de la constancia y la organización rigurosa. A lo largo de mi formación, he consolidado habilidades duras en el desarrollo frontend y el análisis computacional.',
    about_text_2: 'Busco integrar mis conocimientos estructurados de Bizagi/UML con la velocidad de desarrollo de frameworks modernos de JavaScript y la automatización inteligente por medio de IA.',
    highlight_1_title: 'Servicio Militar de Honor',
    highlight_1_desc: 'Mi paso por el servicio militar me enseñó la importancia del trabajo en equipo coordinado, la adaptabilidad bajo alta presión laboral y el cumplimiento estricto de directrices con excelencia.',
    highlight_2_title: 'Competencia Global en Inglés',
    highlight_2_desc: 'He completado estudios avanzados en el idioma inglés, lo que me capacita para comprender documentación técnica de alto nivel, coordinar con equipos multiculturales y desempeñarme internacionalmente con soltura (Nivel C1/B2).'
  };

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('perfil')
        .select('*')
        .eq('id', 'main_profile')
        .maybeSingle();

      if (error) throw error;
      if (data) return data;
    } catch (e) {
      console.warn("Supabase profile fetch failed, using default data.", e);
    }
  }

  try {
    const localProfile = localStorage.getItem('nelva_profile');
    if (localProfile) return JSON.parse(localProfile);
  } catch (err) {}

  return defaultProfile;
}

async function renderProfile() {
  const container = document.getElementById('bio-container');
  if (!container) return;

  const profile = await getProfile();

  let adminBtnHtml = '';
  if (isAdminMode) {
    adminBtnHtml = `
      <div style="position: absolute; top: 0; right: 0; z-index: 10;">
        <button class="proj-admin-btn" id="edit-bio-btn" title="Editar Biografía" style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-secondary); border: 1px solid var(--glass-border); color: var(--color-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast);">
          <i data-lucide="pencil" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    ${adminBtnHtml}
    <h3 class="about-subtitle">${profile.about_subtitle}</h3>
    <p class="about-paragraph">${profile.about_text_1}</p>
    
    <div class="highlight-box">
      <div class="highlight-icon">
        <i data-lucide="shield-check"></i>
      </div>
      <div class="highlight-info">
        <h4>${profile.highlight_1_title}</h4>
        <p>${profile.highlight_1_desc}</p>
      </div>
    </div>

    <div class="highlight-box">
      <div class="highlight-icon">
        <i data-lucide="languages"></i>
      </div>
      <div class="highlight-info">
        <h4>${profile.highlight_2_title}</h4>
        <p>${profile.highlight_2_desc}</p>
      </div>
    </div>

    <p class="about-paragraph">${profile.about_text_2}</p>
  `;

  if (typeof lucide !== 'undefined') {
    try { lucide.createIcons(); } catch (e) {}
  }

  if (isAdminMode) {
    const editBtn = document.getElementById('edit-bio-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => openBioModal(profile));
    }
  }
}

function openBioModal(profile) {
  const modal = document.getElementById('bio-modal');
  if (!modal) return;

  document.getElementById('bio-subtitle-input').value = profile.about_subtitle || '';
  document.getElementById('bio-text1-input').value = profile.about_text_1 || '';
  document.getElementById('bio-text2-input').value = profile.about_text_2 || '';
  document.getElementById('bio-h1-title-input').value = profile.highlight_1_title || '';
  document.getElementById('bio-h1-desc-input').value = profile.highlight_1_desc || '';
  document.getElementById('bio-h2-title-input').value = profile.highlight_2_title || '';
  document.getElementById('bio-h2-desc-input').value = profile.highlight_2_desc || '';

  modal.style.display = 'flex';

  const closeBtn = document.getElementById('close-bio-modal');
  const closeModal = () => { modal.style.display = 'none'; };
  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

function initProfileForm() {
  const form = document.getElementById('bio-form');
  const modal = document.getElementById('bio-modal');
  const submitBtn = document.getElementById('btn-save-bio');

  if (!form || !modal || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const about_subtitle = document.getElementById('bio-subtitle-input').value.trim();
    const about_text_1 = document.getElementById('bio-text1-input').value.trim();
    const about_text_2 = document.getElementById('bio-text2-input').value.trim();
    const highlight_1_title = document.getElementById('bio-h1-title-input').value.trim();
    const highlight_1_desc = document.getElementById('bio-h1-desc-input').value.trim();
    const highlight_2_title = document.getElementById('bio-h2-title-input').value.trim();
    const highlight_2_desc = document.getElementById('bio-h2-desc-input').value.trim();

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Guardando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const updatedProfile = {
      id: 'main_profile',
      about_subtitle,
      about_text_1,
      about_text_2,
      highlight_1_title,
      highlight_1_desc,
      highlight_2_title,
      highlight_2_desc
    };

    try {
      let success = false;
      if (supabaseClient) {
        const { error } = await supabaseClient
          .from('perfil')
          .upsert([updatedProfile]);
        if (error) throw error;
        success = true;
      } else {
        localStorage.setItem('nelva_profile', JSON.stringify(updatedProfile));
        success = true;
      }

      if (success) {
        modal.style.display = 'none';
        await renderProfile();
      }
    } catch (err) {
      alert("Error al guardar biografía: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// ==========================================================================
// 9. AWARDS / ACHIEVEMENTS DATABASE READS, RENDERING & WRITES
// ==========================================================================

async function getAwards() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('reconocimientos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        return data.map(normalizeAwardRecord);
      }
    } catch (e) {
      console.warn("Supabase awards fetch failed. Falling back to local data.", e);
    }
  }

  try {
    const localData = localStorage.getItem('nelva_awards');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeAwardRecord);
    }
  } catch (err) {}

  return inMemoryAwards.map(normalizeAwardRecord);
}

async function renderAwards() {
  const grid = document.getElementById('awards-grid');
  if (!grid) return;

  grid.innerHTML = '';

  let awards = [];
  try {
    awards = await getAwards();
  } catch (e) {
    awards = DEFAULT_AWARDS;
  }

  if (isAdminMode) {
    const addCard = document.createElement('div');
    addCard.className = 'gallery-item add-project-card';
    addCard.id = 'add-award-btn';
    addCard.style.display = 'flex';
    addCard.style.cursor = 'pointer';
    addCard.style.border = '2px dashed rgba(255, 255, 255, 0.1)';
    addCard.style.background = 'transparent';
    addCard.style.borderRadius = 'var(--radius-md)';
    addCard.style.minHeight = '150px';
    addCard.innerHTML = `
      <div class="add-project-content" style="margin: auto;">
        <div class="add-icon-box">
          <i data-lucide="plus"></i>
        </div>
        <span class="add-project-text" style="font-size:0.9rem;">Agregar Logro</span>
      </div>
    `;
    grid.appendChild(addCard);
    addCard.addEventListener('click', () => openAwardModal());
  }

  awards.forEach(award => {
    try {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      
      let adminActions = '';
      if (isAdminMode) {
        adminActions = `
          <div class="project-admin-actions" style="opacity: 1; pointer-events: auto; transform: translateY(0); z-index: 10;">
            <button class="proj-admin-btn award-btn-edit" data-id="${award.id}" title="Editar Logro" style="padding: 6px; margin-right: 4px;">
              <i data-lucide="pencil" style="width:12px; height:12px;"></i>
            </button>
            <button class="proj-admin-btn award-btn-delete" data-id="${award.id}" title="Eliminar Logro" style="padding: 6px;">
              <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
            </button>
          </div>
        `;
      }

      card.innerHTML = `
        ${adminActions}
        <img src="${award.image}" alt="${award.title}" class="gallery-img" loading="lazy">
        <div class="gallery-overlay">
          <div class="gallery-overlay-content">
            <span class="award-tag">${award.tag}</span>
            <h4 class="award-title">${award.title}</h4>
            <p class="award-desc">${award.description}</p>
          </div>
        </div>
      `;
      grid.appendChild(card);
    } catch (err) {
      console.error("Error creating award card", award, err);
    }
  });

  if (typeof lucide !== 'undefined') {
    try { lucide.createIcons(); } catch (e) {}
  }

  attachAwardAdminListeners();
}

function attachAwardAdminListeners() {
  const editButtons = document.querySelectorAll('.award-btn-edit');
  const deleteButtons = document.querySelectorAll('.award-btn-delete');

  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openAwardModal(btn.getAttribute('data-id'));
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteAward(btn.getAttribute('data-id'));
    });
  });
}

async function openAwardModal(id = null) {
  const modal = document.getElementById('award-modal');
  const modalTitle = document.getElementById('award-modal-title');
  const closeBtn = document.getElementById('close-award-modal');
  const previewContainer = document.getElementById('award-image-preview-container');
  const fileInput = document.getElementById('award-image-file');

  if (!modal) return;

  // reset form
  document.getElementById('award-form').reset();
  if (previewContainer) previewContainer.style.display = 'none';
  if (fileInput) fileInput.value = '';
  document.getElementById('award-image').value = '';
  document.getElementById('award-id').value = '';

  if (id) {
    modalTitle.textContent = 'Editar Logro';
    const awards = await getAwards();
    const award = awards.find(a => a.id === id);
    if (award) {
      document.getElementById('award-id').value = award.id || '';
      document.getElementById('award-title-input').value = award.title || '';
      document.getElementById('award-tag-input').value = award.tag || '';
      document.getElementById('award-desc-input').value = award.description || '';
      document.getElementById('award-image').value = award.image || '';

      if (award.image && previewContainer) {
        const previewImg = document.getElementById('award-image-preview');
        if (previewImg) {
          previewImg.src = award.image;
          previewContainer.style.display = 'block';
        }
      }
    }
  } else {
    modalTitle.textContent = 'Agregar Logro';
  }

  modal.style.display = 'flex';
  const closeModal = () => { modal.style.display = 'none'; };
  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

function initAwardForm() {
  const form = document.getElementById('award-form');
  const modal = document.getElementById('award-modal');
  const submitBtn = document.getElementById('btn-save-award');

  if (!form || !modal || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('award-id').value;
    const title = document.getElementById('award-title-input').value.trim();
    const tag = document.getElementById('award-tag-input').value.trim();
    const description = document.getElementById('award-desc-input').value.trim();

    const fileInput = document.getElementById('award-image-file');
    let imageUrl = document.getElementById('award-image').value;

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Guardando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
      if (fileInput && fileInput.files[0]) {
        imageUrl = await uploadFileToStorage(fileInput.files[0], 'awards');
      }

      if (!imageUrl || imageUrl === 'PENDING_FILE_UPLOAD') {
        throw new Error("Por favor, selecciona una imagen para el logro.");
      }

      let success = false;

      if (supabaseClient) {
        if (id) {
          const { error } = await supabaseClient
            .from('reconocimientos')
            .update({ title, tag, description, image: imageUrl })
            .eq('id', id);
          if (error) throw error;
        } else {
          const newAward = {
            id: 'award-' + Date.now(),
            title,
            tag,
            description,
            image: imageUrl
          };
          const { error } = await supabaseClient
            .from('reconocimientos')
            .insert([newAward]);
          if (error) throw error;
        }
        success = true;
      } else {
        let awards = await getAwards();
        if (id) {
          awards = awards.map(a => {
            if (a.id === id) {
              return { id, title, tag, description, image: imageUrl };
            }
            return a;
          });
        } else {
          const newAward = {
            id: 'award-' + Date.now(),
            title,
            tag,
            description,
            image: imageUrl
          };
          awards.push(newAward);
        }
        localStorage.setItem('nelva_awards', JSON.stringify(awards));
        success = true;
      }

      if (success) {
        modal.style.display = 'none';
        await renderAwards();
      }
    } catch (err) {
      alert("Error al guardar logro: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

async function deleteAward(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este logro?')) {
    let success = false;

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('reconocimientos')
          .delete()
          .eq('id', id);
        if (error) throw error;
        success = true;
      } catch (err) {
        alert('Error al borrar de Supabase: ' + err.message);
      }
    } else {
      try {
        let awards = await getAwards();
        awards = awards.filter(a => a.id !== id);
        localStorage.setItem('nelva_awards', JSON.stringify(awards));
        success = true;
      } catch (e) {
        console.error(e);
      }
    }

    if (success) {
      await renderAwards();
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
