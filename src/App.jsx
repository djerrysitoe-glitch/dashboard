import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight, ArrowUpRight, Building2, CalendarCheck2, Check, Globe2, HeartHandshake, LockKeyhole, MessageCircleHeart, PlayCircle, Plus, ShieldCheck, Sparkles, Sprout, Video, X } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const dates = [{ day: 'SEG', number: '23', iso: '2026-09-23' }, { day: 'TER', number: '24', iso: '2026-09-24' }, { day: 'QUA', number: '25', iso: '2026-09-25' }, { day: 'QUI', number: '26', iso: '2026-09-26' }, { day: 'SEX', number: '27', iso: '2026-09-27' }];
const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];

function Eyebrow({ children }) { return <p className="eyebrow"><span />{children}</p>; }

function BookingForm() {
  const [mode, setMode] = useState('Online');
  const [selectedDate, setSelectedDate] = useState(dates[1]);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault(); setIsSubmitting(true); setError('');
    const formData = new FormData(event.currentTarget);
    const appointment = { full_name: formData.get('name'), email: formData.get('email'), mode, appointment_date: selectedDate.iso, appointment_time: selectedTime };
    const { error: insertError } = await supabase.from('appointments').insert(appointment);
    setIsSubmitting(false);
    if (insertError) { setError(insertError.code === '23505' ? 'Este horário acabou de ser reservado. Escolha outro horário, por favor.' : 'Não foi possível registrar seu agendamento agora. Tente novamente em instantes.'); return; }
    setConfirmation(appointment); event.currentTarget.reset();
  }

  return <>
    <form className="booking-card" onSubmit={handleSubmit}>
      <div className="form-header"><div><span className="step-label">PASSO 01 DE 03</span><h3>Qual tipo de atendimento você prefere?</h3></div><span className="form-icon"><MessageCircleHeart /></span></div>
      <div className="choice-grid">{[['Online', Video, 'De onde você estiver'], ['Presencial', Building2, 'Em nosso consultório']].map(([value, Icon, detail]) => <label className={`choice-card ${mode === value ? 'selected' : ''}`} key={value}><input type="radio" name="mode" value={value} checked={mode === value} onChange={() => setMode(value)} /><span className="choice-icon"><Icon /></span><span><strong>{value}</strong><small>{detail}</small></span>{mode === value && <Check className="check-icon" />}</label>)}</div>
      <div className="form-fields"><label>Seu nome<input type="text" name="name" placeholder="Como podemos chamar você?" required /></label><label>Seu melhor e-mail<input type="email" name="email" placeholder="voce@email.com" required /></label></div>
      <div className="date-heading"><span className="step-label">ESCOLHA O SEU HORÁRIO</span><span className="timezone"><Globe2 /> Horário de Brasília</span></div>
      <div className="date-grid">{dates.map(date => <button type="button" className={`date-option ${selectedDate.iso === date.iso ? 'selected' : ''}`} key={date.iso} onClick={() => setSelectedDate(date)}>{date.day}<strong>{date.number}</strong>SET</button>)}</div>
      <div className="time-grid">{times.map(time => <button type="button" className={`time-option ${selectedTime === time ? 'selected' : ''}`} key={time} onClick={() => setSelectedTime(time)}>{time}</button>)}</div>
      {error && <p className="booking-error" role="alert">{error}</p>}
      <button className="button button-primary submit-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrando...' : 'Continuar agendamento'} <ArrowRight /></button>
      <p className="form-footnote"><ShieldCheck /> Seus dados ficam protegidos e não serão compartilhados.</p>
    </form>
    {confirmation && <div className="modal-backdrop visible" role="dialog" aria-modal="true"><div className="success-modal"><button className="modal-close" type="button" aria-label="Fechar" onClick={() => setConfirmation(null)}><X /></button><span className="success-mark"><Check /></span><Eyebrow>Está reservado</Eyebrow><h2>Seu próximo passo<br /><em>começa aqui.</em></h2><p>{confirmation.full_name}, seu pedido para uma sessão {confirmation.mode.toLowerCase()} em {confirmation.appointment_date.slice(8)}/09 às {confirmation.appointment_time.slice(0, 5)} foi recebido. Vamos enviar os próximos detalhes para {confirmation.email}.</p><button className="button button-primary" type="button" onClick={() => setConfirmation(null)}>Perfeito, entendi <ArrowRight /></button></div></div>}
  </>;
}

function App() {
  return <><header className="site-header"><a className="brand" href="#inicio" aria-label="Acolher, início"><span className="brand-mark"><Sprout /></span><span>Acolher</span></a><nav className="main-nav" aria-label="Navegação principal"><a href="#como-funciona">Como funciona</a><a href="#profissionais">Profissionais</a><a href="#duvidas">Dúvidas</a></nav><a className="header-action" href="#agendar">Agendar sessão <ArrowUpRight /></a></header><main>
    <section className="hero" id="inicio"><div className="hero-copy"><Eyebrow>Cuidado psicológico com presença</Eyebrow><h1>Um espaço seguro para <em>você</em> respirar.</h1><p className="hero-text">Encontre apoio profissional para atravessar o que você está vivendo, no seu tempo e do seu jeito.</p><div className="hero-actions"><a className="button button-primary" href="#agendar">Encontrar meu horário <ArrowRight /></a><a className="text-link" href="#como-funciona">Conheça o Acolher <PlayCircle /></a></div><div className="trust-line"><div className="avatars"><span>LM</span><span>BC</span><span>TA</span><span>+</span></div><p>Mais de 2.000 pessoas já encontraram apoio por aqui</p></div></div><div className="hero-art" aria-label="Ilustração de uma pessoa em um momento de pausa"><div className="sun" /><div className="arch" /><div className="plant plant-one"><span /><span /><span /></div><div className="plant plant-two"><span /><span /></div><div className="person"><div className="head" /><div className="hair" /><div className="body" /><div className="arm" /></div><div className="art-note note-one"><HeartHandshake /><span>escuta<br />que acolhe</span></div><div className="art-note note-two"><Sparkles /><span>seu tempo<br />importa</span></div></div></section>
    <section className="proof-strip" id="como-funciona"><div><span className="strip-number">01</span><h2>Comece<br /><em>por você.</em></h2></div><Proof icon={CalendarCheck2} title="Agendamento simples" text="Escolha o melhor horário em poucos passos." /><Proof icon={LockKeyhole} title="Privacidade sempre" text="Um espaço confidencial, do início ao fim." /><Proof icon={Video} title="Online ou presencial" text="Cuide de si de onde fizer sentido." /></section>
    <section className="booking-section" id="agendar"><div className="section-intro"><Eyebrow>Seu próximo passo</Eyebrow><h2>Vamos encontrar um<br /><em>horário para você?</em></h2><p>Conte um pouco do que procura. A primeira conversa começa com calma.</p></div><BookingForm /></section>
    <section className="professionals" id="profissionais"><div className="professionals-title"><Eyebrow>Pessoas que cuidam de pessoas</Eyebrow><h2>Encontre quem<br /><em>caminha com você.</em></h2></div><div className="professional-list"><Professional initials="MC" name="Marina Costa" text="Ansiedade · Adultos" crp="CRP 06/184729" variant="portrait-one" /><Professional initials="RA" name="Rafael Alves" text="Relacionamentos · Adultos" crp="CRP 06/217503" variant="portrait-two" /></div></section>
    <section className="faq" id="duvidas"><div><Eyebrow>Tudo bem ter dúvidas</Eyebrow><h2>Começar pode ser<br /><em>mais leve.</em></h2></div><div className="faq-list"><Faq open title="Como funciona a primeira sessão?">É um primeiro encontro para você conhecer o profissional e contar, no seu ritmo, o que trouxe você até aqui. Não é preciso chegar com tudo organizado.</Faq><Faq title="As sessões são confidenciais?">Sim. O sigilo é parte essencial do atendimento psicológico e seguimos as diretrizes do Conselho Federal de Psicologia.</Faq><Faq title="Posso cancelar ou remarcar?">Você pode remarcar com até 24 horas de antecedência, sem custo.</Faq></div></section>
  </main><footer><a className="brand" href="#inicio"><span className="brand-mark"><Sprout /></span><span>Acolher</span></a><p>Psicologia para a vida real.</p><span>© 2026 Acolher</span></footer></>;
}

function Proof({ icon: Icon, title, text }) { return <div className="proof-item"><span className="icon-disc"><Icon /></span><div><strong>{title}</strong><p>{text}</p></div></div>; }
function Professional({ initials, name, text, crp, variant }) { return <article><div className={`portrait ${variant}`}>{initials}</div><div><h3>{name}</h3><p>{text}</p><span>{crp}</span></div><ArrowUpRight /></article>; }
function Faq({ title, open, children }) { return <details open={open}><summary>{title}<Plus /></summary><p>{children}</p></details>; }

export default App;