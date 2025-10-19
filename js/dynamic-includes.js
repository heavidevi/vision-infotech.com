// Dynamic Include System for HTML Files
// This script loads header, navigation, footer, and scripts dynamically

document.addEventListener('DOMContentLoaded', function() {
    
    // Function to load HTML content
    function loadHTML(elementId, filePath) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                    
                    // If it's the header, move head content to document head
                    if (elementId === 'header-placeholder') {
                        moveHeadContent(data);
                    }
                    
                    // If it's scripts, execute them
                    if (elementId === 'scripts-placeholder') {
                        executeScripts(element);
                    }
                }
            })
            .catch(error => {
                console.error('Error loading ' + filePath + ':', error);
            });
    }
    
    // Function to move head content from loaded HTML to document head
    function moveHeadContent(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const headElements = doc.head.children;
        
        for (let i = 0; i < headElements.length; i++) {
            const element = headElements[i];
            
            // Skip title if page already has one
            if (element.tagName === 'TITLE' && document.title) {
                continue;
            }
            
            // Clone and append to document head
            const clonedElement = element.cloneNode(true);
            document.head.appendChild(clonedElement);
        }
    }
    
    // Function to execute scripts in loaded content
    function executeScripts(container) {
        const scripts = container.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const newScript = document.createElement('script');
            
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            
            document.body.appendChild(newScript);
        }
    }
    
    // Load all components
    loadHTML('header-placeholder', 'includes/header.html');
    loadHTML('navigation-placeholder', 'includes/navigation.html');
    loadHTML('footer-placeholder', 'includes/footer.html');
    loadHTML('scripts-placeholder', 'includes/scripts.html');
    
    // Set active navigation item based on current page
    setTimeout(function() {
        setActiveNavigation();
    }, 500); // Wait for navigation to load
});

// Function to set active navigation item
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-menu a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            // Remove active class from all items
            document.querySelectorAll('.main-menu li, .mobile-menu li').forEach(li => {
                li.classList.remove('active');
            });
            // Add active class to current item
            link.closest('li').classList.add('active');
        }
    });
}
