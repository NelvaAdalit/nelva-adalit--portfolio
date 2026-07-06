/* ==========================================================================
   NELVA ADALIT PORTFOLIO - LOGIC & INTERACTION (WITH CRUD & LIGHTBOX)
   Contains: Projects CRUD, LocalStorage DB, Lightbox, Mobile menu, Scroll reveal
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

// --- Global App State ---
let isAdminMode = false;
let currentFilter = 'all';
let inMemoryProjects = [...DEFAULT_PROJECTS];

// --- Safe Initialization Wrapper (Defensive against load errors) ---
const init = () => {
  const steps = [
    { name: "Database Init", fn: initDatabase },
    { name: "Render Projects", fn: renderProjects },
    { name: "Project Filters", fn: initProjectFilters },
    { name: "Mobile Menu", fn: initMobileMenu },
    { name: "Admin Mode", fn: initAdminMode },
    { name: "Project Form CRUD", fn: initProjectForm },
    { name: "Certificate Lightbox", fn: initCertificateLightbox },
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

  // Safe Lucide icon call
  try {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (e) {
    console.error("Lucide failure", e);
  }
};

// Check readyState for module compatibility
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ==========================================================================
// 1. DATABASE & STORAGE MANAGEMENT (With Memory Fallback)
// ==========================================================================

/**
 * Initializes localStorage with default seed data if it does not exist
 */
function initDatabase() {
  try {
    if (!localStorage.getItem('nelva_projects')) {
      localStorage.setItem('nelva_projects', JSON.stringify(DEFAULT_PROJECTS));
    }
  } catch (e) {
    console.warn("localStorage is blocked or disabled. Running in-memory database fallback.", e);
  }
}

/**
 * Retrieves projects array from localStorage or in-memory backup
 * @returns {Array} Array of projects
 */
function getProjects() {
  try {
    const data = localStorage.getItem('nelva_projects');
    if (!data) return DEFAULT_PROJECTS;
    
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PROJECTS;
  } catch (e) {
    console.warn("Could not read from localStorage, using memory storage.", e);
    return inMemoryProjects;
  }
}

/**
 * Saves projects array to localStorage or memory db
 * @param {Array} projects 
 */
function saveProjects(projects) {
  try {
    localStorage.setItem('nelva_projects', JSON.stringify(projects));
  } catch (e) {
    console.warn("Could not write to localStorage, saving to in-memory store.", e);
    inMemoryProjects = projects;
  }
}

// ==========================================================================
// 2. PROJECT RENDERING & INTEGRATION (Defensive variables)
// ==========================================================================

/**
 * Renders the project cards grid based on current filter and admin state
 */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Clear grid contents
  grid.innerHTML = '';

  let projects = [];
  try {
    projects = getProjects();
  } catch (e) {
    console.error("Error reading projects list, falling back to seeds", e);
    projects = DEFAULT_PROJECTS;
  }

  const filteredProjects = projects.filter(proj => {
    if (!proj) return false;
    const cat = proj.category || 'web';
    return currentFilter === 'all' || cat === currentFilter;
  });

  // If Admin Mode is active, render the dashed 'Add Project' card first
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
    
    // Add Click listener to open creation modal
    addCard.addEventListener('click', () => openProjectModal());
  }

  // Render project card elements
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
        <!-- Admin Controls Overlay -->
        <div class="project-admin-actions">
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
      console.error("Error creating project card structure", proj, err);
    }
  });

  // Reinitialize Lucide Icons for dynamic content
  if (typeof lucide !== 'undefined') {
    try {
      lucide.createIcons();
    } catch (e) {
      console.error("Lucide update failed", e);
    }
  }

  // Attach event handlers to card edit and delete buttons
  attachCardAdminListeners();
}

/**
 * Attaches event listeners for edit/delete actions inside project cards
 */
function attachCardAdminListeners() {
  const editButtons = document.querySelectorAll('.proj-btn-edit');
  const deleteButtons = document.querySelectorAll('.proj-btn-delete');

  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openProjectModal(id);
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      deleteProject(id);
    });
  });
}

/**
 * Maps category codes to user-friendly Spanish labels
 * @param {string} cat Category code
 * @returns {string} User-friendly label
 */
function getCategoryName(cat) {
  switch (cat) {
    case 'web': return 'Desarrollo Web';
    case 'ai': return 'Inteligencia Artificial';
    case 'process': return 'Bizagi & UML';
    default: return cat || 'Desarrollo';
  }
}

/**
 * Maps technology names to matching Lucide icon identifier strings
 * @param {string} tech Technology tag string
 * @returns {string} Lucide icon name
 */
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
// 3. CRUD LOGIC (CREATE, READ, UPDATE, DELETE)
// ==========================================================================

/**
 * Sets up the Admin toggle button interactions in the Navbar
 */
function initAdminMode() {
  const toggleBtn = document.getElementById('admin-toggle');
  const grid = document.getElementById('projects-grid');
  const toggleText = document.getElementById('admin-toggle-text');

  if (!toggleBtn || !grid) return;

  toggleBtn.addEventListener('click', () => {
    isAdminMode = !isAdminMode;
    
    // Toggle active state styling classes
    toggleBtn.classList.toggle('active');
    grid.classList.toggle('admin-mode-active');
    
    // Update button visual contents (icons and labels)
    if (isAdminMode) {
      if (toggleText) toggleText.textContent = 'Salir Editor';
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', 'lock-open');
    } else {
      if (toggleText) toggleText.textContent = 'Modo Editor';
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', 'lock');
    }
    
    if (typeof lucide !== 'undefined') {
      try {
        lucide.createIcons();
      } catch (e) {
        console.error(e);
      }
    }

    // Re-render project grid to show/hide edit buttons and add card
    renderProjects();
  });
}

/**
 * Handles tab category changes
 */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderProjects();
    });
  });
}

/**
 * Opens the Project form modal for creation or editing
 * @param {string} [id] Optional project ID to edit
 */
function openProjectModal(id = null) {
  const modal = document.getElementById('project-modal');
  const form = document.getElementById('project-form');
  const modalTitle = document.getElementById('modal-title');
  const closeBtn = document.getElementById('close-project-modal');

  if (!modal || !form || !modalTitle) return;

  // Reset form inputs
  form.reset();
  const idInput = document.getElementById('project-id');
  if (idInput) idInput.value = '';

  if (id) {
    // Edit mode
    modalTitle.textContent = 'Editar Proyecto';
    const projects = getProjects();
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
    }
  } else {
    // Create mode
    modalTitle.textContent = 'Agregar Proyecto';
  }

  // Show Modal
  modal.style.display = 'flex';

  // Close triggers
  const closeModal = () => {
    modal.style.display = 'none';
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  // Close on ESC press
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

/**
 * Configures the Project creation / modification submit handlers
 */
function initProjectForm() {
  const form = document.getElementById('project-form');
  const modal = document.getElementById('project-modal');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('project-id').value;
    const title = document.getElementById('proj-title').value.trim();
    const category = document.getElementById('proj-category').value;
    const image = document.getElementById('proj-image').value;
    const description = document.getElementById('proj-desc').value.trim();
    const techs = document.getElementById('proj-techs').value.trim();
    const codeLink = document.getElementById('proj-code').value.trim();
    const demoLink = document.getElementById('proj-demo').value.trim();

    let projects = getProjects();

    if (id) {
      // Update existing project
      projects = projects.map(p => {
        if (p.id === id) {
          return { id, title, category, image, description, techs, codeLink, demoLink };
        }
        return p;
      });
    } else {
      // Create new project
      const newProj = {
        id: 'user-proj-' + Date.now(),
        title,
        category,
        image,
        description,
        techs,
        codeLink,
        demoLink
      };
      projects.push(newProj);
    }

    saveProjects(projects);
    modal.style.display = 'none';
    renderProjects();
  });
}

/**
 * Deletes a project from database
 * @param {string} id Project ID
 */
function deleteProject(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este proyecto de tu portafolio?')) {
    let projects = getProjects();
    projects = projects.filter(p => p.id !== id);
    saveProjects(projects);
    renderProjects();
  }
}

// ==========================================================================
// 4. CERTIFICATE LIGHTBOX (VISOR ESTILO PRENDA)
// ==========================================================================

/**
 * Configures the certificate cards visual zoom/lightbox popups
 */
function initCertificateLightbox() {
  const certCards = document.querySelectorAll('.interactive-cert');
  const lightbox = document.getElementById('cert-lightbox');
  const closeBtn = document.getElementById('close-cert-lightbox');

  if (!certCards.length || !lightbox) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxIssuer = document.getElementById('lightbox-issuer');
  const lightboxDesc = document.getElementById('lightbox-desc-text');
  const lightboxId = document.getElementById('lightbox-id');
  const lightboxVerifyBtn = document.getElementById('lightbox-verify-btn');

  // Attach click listener to each certificate card
  certCards.forEach(card => {
    card.addEventListener('click', () => {
      // Retrieve metadata attributes
      const image = card.getAttribute('data-image') || '';
      const tag = card.getAttribute('data-tag') || 'Credencial';
      
      const titleEl = card.querySelector('.cert-title');
      const title = titleEl ? titleEl.textContent : 'Certificado';
      
      const issuer = card.getAttribute('data-issuer') || '';
      const desc = card.getAttribute('data-desc') || '';
      const certId = card.getAttribute('data-id') || '';
      const verifyUrl = card.getAttribute('data-verify') || '';

      // Populate Lightbox fields
      if (lightboxImg) lightboxImg.src = image;
      if (lightboxTag) lightboxTag.textContent = tag;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxIssuer) lightboxIssuer.textContent = issuer;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      if (lightboxId) lightboxId.textContent = certId;
      if (lightboxVerifyBtn) {
        lightboxVerifyBtn.href = verifyUrl;
      }

      // Show Lightbox Modal
      lightbox.style.display = 'flex';
    });
  });

  // Close actions
  const closeLightbox = () => {
    lightbox.style.display = 'none';
  };

  if (closeBtn) closeBtn.onclick = closeLightbox;
  
  lightbox.onclick = (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  };

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });
}

// ==========================================================================
// 5. BASE SITE FEATURES (MOBILE NAV, SCROLL EFFECTS, FORM MOCKS)
// ==========================================================================

/**
 * Sets up mobile hamburger navigation menu toggles
 */
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

/**
 * Handles active header state on scroll and highlights current nav section link
 */
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

/**
 * Scroll reveal animations (adds class .revealed when elements enter the screen)
 */
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
    // Fallback if observer is unsupported
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }
}

/**
 * Manages the contact form state and mock submission success
 */
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
