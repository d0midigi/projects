document.addEventListener('DOMContentLoaded', () => {
  const allAccordionItems = document.querySelectorAll('.accordion-item');

  allAccordionItems.forEach(item => {
    const button = item.querySelector('.accordion-button');

    button.addEventListener('click', () => {
      const clickedItem = button.closest('.accordion-item');
      const isCurrentlyExpanded = button.getAttribute('aria-expanded') === 'true';

      // --- This is the new logic ---
      // First, close all accordion items.
      allAccordionItems.forEach(otherItem => {
        const otherButton = otherItem.querySelector('.accordion-button');
        otherButton.setAttribute('aria-expanded', 'false');
        const otherContent = otherButton.nextElementSibling;
        otherContent.style.maxHeight = '0px';
      });
      // --- End of new logic ---

      // If the clicked item was not already open, then open it.
      if (!isCurrentlyExpanded) {
        button.setAttribute('aria-expanded', 'true');
        const content = button.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + 'px';
      }
      // If it was already open, the loop above has already closed it.
    });
  });
});