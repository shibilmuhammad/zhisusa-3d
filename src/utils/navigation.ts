import { SceneKey } from "@/animations/constants";

/**
 * Scrolls to a specific section by its scene key
 * Centers the section in the viewport
 */
export function scrollToSection(sceneKey: SceneKey): void {
  console.log("🔍 Navigation: Attempting to scroll to", sceneKey);
  
  // On mobile, use the section element with id
  const isMobile = window.innerWidth <= 768;
  
  // Try to find the target element - check both mobile sections and overlay cards
  let targetElement: HTMLElement | null = null;
  
  if (isMobile) {
    // On mobile, prefer the section element
    targetElement = document.querySelector(`#section-${sceneKey}`) as HTMLElement;
    // Fallback to overlay card if section not found
    if (!targetElement) {
      targetElement = document.querySelector(`[data-scene-key="${sceneKey}"]`) as HTMLElement;
    }
  } else {
    // On desktop, use overlay card
    targetElement = document.querySelector(`[data-scene-key="${sceneKey}"]`) as HTMLElement;
  }
  
  if (!targetElement) {
    console.error("❌ Navigation: Could not find element for:", sceneKey);
    // List all available sections for debugging
    const allSections = document.querySelectorAll('[data-scene-key], .scene-section, #section-hero, #section-live, #section-work, #section-leisure, #section-booking, #section-gallery, #section-footer');
    console.log("📋 Available sections:", 
      Array.from(allSections).map(el => {
        const key = el.getAttribute('data-scene-key') || el.id.replace('section-', '') || el.className;
        return key;
      })
    );
    return;
  }
  
  console.log("✅ Navigation: Found element", targetElement, "at position", targetElement.getBoundingClientRect().top);
  
  // On mobile, scroll to top of section
  if (isMobile) {
    // Calculate scroll position
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetScroll = rect.top + scrollTop;
    
    window.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: "smooth"
    });
    return;
  }
  
  // Desktop: center the element
  const rect = targetElement.getBoundingClientRect();
  const absoluteTop = rect.top + window.pageYOffset;
  
  // Calculate scroll position to center element
  const viewportHeight = window.innerHeight;
  const elementHeight = rect.height;
  const targetScroll = absoluteTop - (viewportHeight / 2) + (elementHeight / 2);
  
  console.log("📍 Navigation: Scroll details", {
    elementTop: absoluteTop,
    currentScroll: window.pageYOffset,
    targetScroll: targetScroll,
    elementHeight: elementHeight,
    viewportHeight: viewportHeight
  });
  
  // Perform scroll
  window.scrollTo({
    top: Math.max(0, targetScroll),
    behavior: "smooth"
  });
  
  console.log("✨ Navigation: Scroll initiated to", targetScroll);
}

/**
 * Check if navigation is properly set up
 */
export function debugNavigationSetup(): void {
  console.log("=== Navigation Debug ===");
  
  // Check if page can scroll
  const bodyHeight = document.body.scrollHeight;
  const windowHeight = window.innerHeight;
  const canScroll = bodyHeight > windowHeight;
  
  console.log("📏 Page dimensions:", {
    bodyHeight,
    windowHeight,
    canScroll,
    currentScroll: window.pageYOffset
  });
  
  // Check all sections
  const sections = document.querySelectorAll('[data-scene-key]');
  console.log(`📦 Found ${sections.length} sections with data-scene-key`);
  
  sections.forEach((section, index) => {
    const key = section.getAttribute('data-scene-key');
    const rect = section.getBoundingClientRect();
    console.log(`  ${index + 1}. ${key}:`, {
      top: rect.top + window.pageYOffset,
      height: rect.height
    });
  });
  
  // Check computed styles
  const pageElement = document.querySelector('.page');
  if (pageElement) {
    const styles = window.getComputedStyle(pageElement);
    console.log("🎨 Page styles:", {
      overflow: styles.overflow,
      overflowY: styles.overflowY,
      position: styles.position,
      height: styles.height
    });
  }
}




