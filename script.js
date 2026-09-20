const icons = () => window.lucide && lucide.createIcons();
const dateGrid = document.querySelector('#date-grid');
const timeGrid = document.querySelector('#time-grid');
const form = document.querySelector('#booking-form');
const modal = document.querySelector('#success-modal');
const supabaseConfig = window.SUPABASE_CONFIG || {};
const hasSupabaseConfig = supabaseConfig.url && supabaseConfig.anonKey && !supabaseConfig.url.includes('SEU-PROJETO') && !supabaseConfig.anonKey.includes('SUA_CHAVE');
const supabaseClient = hasSupabaseConfig && window.supabase
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

const dates = [
  { day: 'SEG', number: '23', iso: '2026-09-23' }, { day: 'TER', number: '24', iso: '2026-09-24' },
  { day: 'QUA', number: '25', iso: '2026-09-25' }, { day: 'QUI', number: '26', iso: '2026-09-26' },
  { day: 'SEX', number: '27', iso: '2026-09-27' }
];
const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];

dates.forEach((date, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `date-option${index === 1 ? ' selected' : ''}`;
  button.dataset.date = date.iso;
  button.innerHTML = `${date.day}<strong>${date.number}</strong>SET`;
  button.addEventListener('click', () => {
    document.querySelectorAll('.date-option').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
  });
  dateGrid.appendChild(button);
});

times.forEach((time, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `time-option${index === 0 ? ' selected' : ''}`;
  button.textContent = time;
  button.addEventListener('click', () => {
    document.querySelectorAll('.time-option').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
  });
  timeGrid.appendChild(button);
});

document.querySelectorAll('.choice-card input').forEach(input => {
  input.addEventListener('change', () => {
    document.querySelectorAll('.choice-card').forEach(card => card.classList.remove('selected'));
    input.closest('.choice-card').classList.add('selected');
  });
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  const data = new FormData(form);
  const selectedDate = document.querySelector('.date-option.selected strong').textContent;
  const selectedTime = document.querySelector('.time-option.selected').textContent;
  const selectedDateButton = document.querySelector('.date-option.selected');
  const appointmentDate = selectedDateButton.dataset.date;

  if (supabaseClient) {
    const { error } = await supabaseClient.from('appointments').insert({
      full_name: data.get('name'),
      email: data.get('email'),
      mode: data.get('mode'),
      appointment_date: appointmentDate,
      appointment_time: selectedTime
    });
    if (error) {
      submitButton.disabled = false;
      if (error.code === '23505') {
        alert('Este horário acabou de ser reservado. Escolha outro horário, por favor.');
      } else {
        alert('Não foi possível registrar seu agendamento agora. Tente novamente em instantes.');
        console.error(error);
      }
      return;
    }
  }

  document.querySelector('#success-message').textContent = `${data.get('name')}, seu pedido para uma sessão ${data.get('mode').toLowerCase()} em ${selectedDate}/09 às ${selectedTime} foi recebido. Vamos enviar os próximos detalhes para ${data.get('email')}.`;
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  submitButton.disabled = false;
});

const closeModal = () => {
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
};
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('#modal-done').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
icons();