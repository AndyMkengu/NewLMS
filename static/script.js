document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    const slideCount = slides.length;

    // Create dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.style.opacity = index === currentSlide ? '1' : '0';
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto slide change
    let slideInterval = setInterval(nextSlide, 3000);

    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Dropdown menu functionality for mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';

                // Close other open dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.style.display = 'none';
                    }
                });
            }
        });
    });

    // Submenu functionality for mobile
    const submenuToggles = document.querySelectorAll('.dropdown-submenu > a');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';

                // Close other open submenus
                document.querySelectorAll('.submenu').forEach(menu => {
                    if (menu !== submenu) {
                        menu.style.display = 'none';
                    }
                });
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && window.innerWidth <= 992) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });

    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    function performSearch() {
        const query = searchBar.value.trim();
        if (query) {
            alert(`Searching for: ${query}`);
            // In a real implementation, you would redirect to search results or filter content
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Course card interactions
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on a button inside the card
            if (!e.target.closest('button')) {
                alert(`Navigating to course: ${this.querySelector('h3').textContent}`);
                // In a real implementation, you would navigate to the course page
            }
        });
    });

    // Grade view buttons
    const gradeViewBtns = document.querySelectorAll('.btn-view');

    gradeViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseName = this.closest('tr').querySelector('td:first-child').textContent;
            alert(`Viewing grades for: ${courseName}`);
            // In a real implementation, you would show detailed grade information
        });
    });

    // Enroll buttons
    const enrollBtns = document.querySelectorAll('.btn-enroll');

    enrollBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseName = this.closest('.course-card').querySelector('h3').textContent;
            alert(`Enrolling in: ${courseName}`);
            // In a real implementation, you would handle the enrollment process
        });
    });
});

// File Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const fileTypeBtns = document.querySelectorAll('.file-type-btn');

    // File type filtering
    fileTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            fileTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterFiles(this.dataset.type);
        });
    });

    // Click to browse files
    dropZone.addEventListener('click', () => fileInput.click());

    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('drag-over');
    }

    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }

    // Handle file drop
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle file selection
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // Process selected files
    function handleFiles(files) {
        [...files].forEach(file => {
            if (validateFileType(file)) {
                previewFile(file);
            } else {
                alert(`File type not supported: ${file.name}`);
            }
        });
    }

    // Validate file types
    function validateFileType(file) {
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo'
        ];
        return validTypes.includes(file.type);
    }

    // Preview uploaded files
    function previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            const fileCard = createFileCard(file);
            filePreview.appendChild(fileCard);
        };
    }

    // Create file card element
    function createFileCard(file) {
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        fileCard.dataset.type = getFileType(file);

        const fileType = getFileType(file);
        const iconClass = getIconClass(fileType);

        fileCard.innerHTML = `
            <div class="file-icon ${iconClass}">
                ${getFileIcon(fileType)}
            </div>
            <div class="file-info">
                <div class="file-name" title="${file.name}">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="remove-file">&times;</button>
        `;

        // Add remove functionality
        fileCard.querySelector('.remove-file').addEventListener('click', () => {
            fileCard.remove();
        });

        return fileCard;
    }

    // Helper functions
    function getFileType(file) {
        if (file.type.includes('pdf')) return 'pdf';
        if (file.type.includes('word')) return 'document';
        if (file.type.includes('excel') || file.type.includes('spreadsheet')) return 'spreadsheet';
        if (file.type.includes('video')) return 'video';
        return 'other';
    }

    function getIconClass(fileType) {
        return fileType; // matches CSS classes
    }

    function getFileIcon(fileType) {
        const icons = {
            pdf: '<i class="fas fa-file-pdf"></i>',
            document: '<i class="fas fa-file-word"></i>',
            spreadsheet: '<i class="fas fa-file-excel"></i>',
            video: '<i class="fas fa-file-video"></i>',
            other: '<i class="fas fa-file"></i>'
        };
        return icons[fileType] || icons.other;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Filter files by type
    function filterFiles(type) {
        const files = document.querySelectorAll('.file-card');
        files.forEach(file => {
            if (type === 'all' || file.dataset.type === type) {
                file.style.display = 'flex';
            } else {
                file.style.display = 'none';
            }
        });
    }

    // Form submission
    document.getElementById('courseForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Here you would collect all form data and send to server
        const courseData = {
            title: document.getElementById('courseTitle').value,
            description: document.getElementById('courseDescription').value,
            files: Array.from(filePreview.children).map(fileCard => {
                return {
                    name: fileCard.querySelector('.file-name').textContent,
                    type: fileCard.dataset.type
                    // In real app, you would upload files and get their URLs
                };
            })
        };

        console.log('Course data to submit:', courseData);
        alert('Course created successfully! (This would submit to server in real app)');
        // window.location.href = 'courses.html'; // Redirect after creation
    });
});




