// Interactive behavior for lesson page
document.addEventListener('DOMContentLoaded', () => {
  // Shuffle sequence cards initially
  const sequenceEl = document.getElementById('sequence');
  shuffleChildren(sequenceEl);

  // Manage selection ordering
  const cards = Array.from(document.querySelectorAll('.seq-card'));
  let selectedOrder = [];

  cards.forEach(card => {
    card.addEventListener('click', () => toggleSelect(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSelect(card) }
    });
  });

  document.getElementById('check-order').addEventListener('click', checkOrder);
  document.getElementById('reset-order').addEventListener('click', resetOrder);

  // Quiz handling
  document.getElementById('submit-quiz').addEventListener('click', submitQuiz);

  function toggleSelect(card){
    const idx = selectedOrder.indexOf(card);
    if (idx === -1) {
      selectedOrder.push(card);
      card.setAttribute('aria-pressed','true');
      card.style.opacity = 0.9;
    } else {
      selectedOrder.splice(idx,1);
      card.setAttribute('aria-pressed','false');
      card.style.opacity = 1;
    }
    updateOrderNumbers();
  }

  function updateOrderNumbers(){
    // show small number badge via aria-label for screen readers
    selectedOrder.forEach((c,i)=> c.setAttribute('aria-label', `${c.textContent.trim()} — position ${i+1}`));
    // clear aria-label for unselected
    cards.filter(c => !selectedOrder.includes(c)).forEach(c => c.setAttribute('aria-label', c.textContent.trim()));
  }

  function checkOrder(){
    const feedback = document.getElementById('order-feedback');
    if (selectedOrder.length !== cards.length){
      feedback.textContent = 'Please select all cards in the order you think is right.';
      return;
    }
    const chosenSteps = selectedOrder.map(c => Number(c.dataset.step));
    const correct = JSON.stringify(chosenSteps) === JSON.stringify([1,2,3,4]);
    feedback.textContent = correct ? 'Great job! That is the correct order.' : 'Not quite — try again or press Reset to start over.';
  }

  function resetOrder(){
    selectedOrder = [];
    cards.forEach(c => { c.setAttribute('aria-pressed','false'); c.style.opacity = 1; c.removeAttribute('aria-label') });
    shuffleChildren(sequenceEl);
    document.getElementById('order-feedback').textContent = '';
  }

  function submitQuiz(){
    const feedback = document.getElementById('quiz-feedback');
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    if (!q1 || !q2) { feedback.textContent = 'Please answer both questions.'; return; }
    let score = 0;
    if (q1.value === 'b') score++;
    if (q2.value === 'b') score++;
    feedback.textContent = `You scored ${score}/2. ${score === 2 ? 'Excellent!' : score === 1 ? 'Nice try — one more time!' : 'Keep practicing!'}`;
  }
});

// Utility: shuffle child elements of a container
function shuffleChildren(container){
  for (let i = container.children.length; i >= 0; i--) {
    container.appendChild(container.children[Math.random() * i | 0]);
  }
}
