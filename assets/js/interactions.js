const dataLayer=window.dataLayer=window.dataLayer||[]; const track=window.PGTrack||((event,params={})=>dataLayer.push({event,...params}));
track('page_view_internal',{page_type:'landing'});
  document.querySelector('.hero-actions .btn-light')?.addEventListener('click',()=>track('hero_secondary_click',{placement:'hero',label:'Подивитися кейси'}));

  // Wave 3: click-to-load video
  const videoPosterV8=document.getElementById('videoPosterV8');
  videoPosterV8?.addEventListener('click',()=>{
    const frame=document.getElementById('videoFrameV8');
    frame.innerHTML='<iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube-nocookie.com/embed/ZdRjzIaQEyE?rel=0&autoplay=1" title="Відео про наш підхід"></iframe>';
    track('video_play',{video_id:'approach_temp'});
  });

  document.getElementById('methodCaseV10')?.addEventListener('click',()=>track('method_case_open',{case_id:'zhuk'}));

  // FAQ filters + deep links
  const faqItemsV8=[...document.querySelectorAll('.faq-item[data-faq-category]')];
  document.querySelectorAll('[data-faq-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-faq-filter]').forEach(b=>b.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    const f=btn.dataset.faqFilter;
    faqItemsV8.forEach(item=>item.hidden=f!=='all'&&item.dataset.faqCategory!==f);
  }));
  document.querySelectorAll('.faq-item[id] .faq-question').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    setTimeout(()=>{if(item.classList.contains('open'))track('faq_open',{faq_id:item.id,category:item.dataset.faqCategory||'other'});},0)
  }));
  if(location.hash.startsWith('#faq-')){
    const target=document.querySelector(location.hash);
    if(target){
      target.hidden=false;
      const q=target.querySelector('.faq-question');
      if(q && !target.classList.contains('open'))q.click();
      setTimeout(()=>target.scrollIntoView({block:'center'}),100);
    }
  }

  // Track case views for qualification context
  document.querySelectorAll('a[href*="cases/"],[data-open-case]').forEach(el=>el.addEventListener('click',()=>{
    const raw=el.getAttribute('href')||el.dataset.openCase||'';
    const id=raw.split('/').pop().replace('.html','');
    const viewed=new Set((sessionStorage.getItem('cases_viewed')||'').split(',').filter(Boolean));
    if(id){viewed.add(id);sessionStorage.setItem('cases_viewed',[...viewed].join(','));}
  }));

  // Mobile sticky CTA should not cover the form
  const mobileStickyCtaV8=document.getElementById('mobileStickyCtaV8');
  const contactV8=document.getElementById('contact');
  if(mobileStickyCtaV8&&contactV8){
    new IntersectionObserver(entries=>mobileStickyCtaV8.classList.toggle('hidden',entries[0].isIntersecting),{threshold:.05}).observe(contactV8);
  }

  // Consent manager: external analytics/marketing tags are intentionally NOT loaded in this prototype.
  const consentKeyV8='pg_cookie_consent_v1';
  const cookieBannerV8=document.getElementById('cookieBannerV8');
  const cookieModalV8=document.getElementById('cookieModalV8');
  const analyticsConsentV8=document.getElementById('analyticsConsentV8');
  const marketingConsentV8=document.getElementById('marketingConsentV8');
  const getConsentV8=()=>{try{return JSON.parse(localStorage.getItem(consentKeyV8)||'null')}catch{return null}};
  const applyConsentV8=(c)=>{
    window.PG_CONSENT=c;
    dataLayer.push({event:'consent_update',analytics_storage:c?.analytics?'granted':'denied',ad_storage:c?.marketing?'granted':'denied'});
  };
  const saveConsentV8=(c)=>{
    localStorage.setItem(consentKeyV8,JSON.stringify(c));applyConsentV8(c);cookieBannerV8.hidden=true;cookieModalV8.hidden=true;
  };
  const openCookieSettingsV8=()=>{
    const c=getConsentV8()||{analytics:false,marketing:false};
    analyticsConsentV8.checked=!!c.analytics;marketingConsentV8.checked=!!c.marketing;cookieModalV8.hidden=false;
    track('consent_preferences_open',{});
  };
  const currentConsentV8=getConsentV8();
  if(currentConsentV8)applyConsentV8(currentConsentV8);else cookieBannerV8.hidden=false;
  document.getElementById('cookieAcceptV8')?.addEventListener('click',()=>saveConsentV8({necessary:true,analytics:true,marketing:true}));
  document.getElementById('cookieRejectV8')?.addEventListener('click',()=>saveConsentV8({necessary:true,analytics:false,marketing:false}));
  document.getElementById('cookieSettingsV8')?.addEventListener('click',openCookieSettingsV8);
  document.getElementById('cookiePrefsV8')?.addEventListener('click',openCookieSettingsV8);
  document.getElementById('cookieCloseV8')?.addEventListener('click',()=>cookieModalV8.hidden=true);
  document.getElementById('cookieSaveV8')?.addEventListener('click',()=>saveConsentV8({necessary:true,analytics:analyticsConsentV8.checked,marketing:marketingConsentV8.checked}));

  // Footer/contact analytics
  document.querySelectorAll('[data-contact-method]').forEach(el=>el.addEventListener('click',()=>track('contact_method_click',{method:el.dataset.contactMethod})));
  document.querySelectorAll('.footer-v6 a').forEach(el=>el.addEventListener('click',()=>track('footer_link_click',{label:el.textContent.trim(),href:el.getAttribute('href')||''})));

  
  document.querySelectorAll('.faq-item[id]').forEach(item=>{
    const q=item.querySelector('.faq-question');
    if(!q || item.querySelector('.faq-copy-v10'))return;
    const b=document.createElement('button');
    b.type='button';b.className='faq-copy-v10';b.textContent='Копіювати посилання';
    b.addEventListener('click',async e=>{
      e.stopPropagation();
      const url=new URL(location.href);url.hash=item.id;
      try{await navigator.clipboard.writeText(url.href);b.textContent='Скопійовано';setTimeout(()=>b.textContent='Копіювати посилання',1400)}catch{history.replaceState(null,'',url.href)}
      track('faq_deeplink_copy',{faq_id:item.id});
    });
    item.querySelector('.faq-answer')?.appendChild(b);
  });

  // Form hidden context
  const referrerHiddenV8=document.getElementById('referrerHiddenV8'),landingHiddenV8=document.getElementById('landingHiddenV8'),casesViewedHiddenV8=document.getElementById('casesViewedHiddenV8');
  if(referrerHiddenV8)referrerHiddenV8.value=document.referrer||'';
  if(landingHiddenV8)landingHiddenV8.value=location.href;
  const syncCasesViewedV8=()=>{if(casesViewedHiddenV8)casesViewedHiddenV8.value=sessionStorage.getItem('cases_viewed')||''};
  syncCasesViewedV8();

  const FORM_ENDPOINT = window.PG_CONFIG?.FORM_ENDPOINT || '';

  document.querySelectorAll('[data-case-filter]').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-case-filter]').forEach(b=>b.setAttribute('aria-pressed','false'));
      btn.setAttribute('aria-pressed','true');
      const f=btn.dataset.caseFilter;
      let visible=0;
      document.querySelectorAll('.case[data-tags]').forEach(card=>{
        const show=f==='all'||card.dataset.tags.split(' ').includes(f);
        card.hidden=!show;if(show)visible++;
      });
      const empty=document.getElementById('caseEmptyV10');
      if(empty)empty.hidden=visible>0;
      const url=new URL(location.href); url.searchParams.set('case_filter',f); history.replaceState(null,'',url.pathname+url.search+location.hash);
      track('case_filter',{filter:f,visible_cases:visible});
    }));
  document.querySelectorAll('.case-foot a,.case-preview-btn').forEach(el=>el.addEventListener('click',e=>e.stopPropagation()));
  const initialCaseFilterV7=new URL(location.href).searchParams.get('case_filter');
  if(initialCaseFilterV7){
    const filterBtn=document.querySelector(`[data-case-filter="${initialCaseFilterV7}"]`);
    if(filterBtn)filterBtn.click();
  }



  
  document.querySelectorAll('[data-trust-item]').forEach(el=>el.addEventListener('click',()=>{
    track('trust_item_click',{item_id:el.dataset.trustItem});
    track('case_open',{case_id:el.dataset.trustItem,source:'trust_strip'});
  }));
  document.querySelectorAll('[data-credential]').forEach(el=>el.addEventListener('click',()=>{
    track('credential_click',{credential_id:el.dataset.credential});
  }));

  // Active navigation section
  const navSectionLinks=[...document.querySelectorAll('.nav-links a[href^="#"]')];
  navSectionLinks.forEach(a=>a.addEventListener('click',()=>track('nav_click',{label:a.textContent.trim(),section_id:a.getAttribute('href').slice(1)})));
  const navSections=navSectionLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navSectionLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
      }
    });
  },{rootMargin:'-20% 0px -65% 0px',threshold:0});
  navSections.forEach(s=>navObserver.observe(s));

  // Interactive bottleneck map
  const gapButtons=[...document.querySelectorAll('.gap-node-v7')];
  const gapDetailV7=document.getElementById('gapDetailV7');
  const gapLossV7=document.getElementById('gapLossV7');
  const gapPairV7=document.getElementById('gapPairV7');
  let gapSelected=[];
  const renderGapV7=()=>{
    if(!gapDetailV7)return;
    const title=gapDetailV7.querySelector('strong');
    const body=gapDetailV7.querySelector('p');
    if(gapSelected.length===0){
      title.textContent='Оберіть один або два вузли';
      body.textContent='Покажемо типовий симптом, можливу втрату та питання, яке треба перевірити на ваших даних.';
      gapLossV7.textContent='';
      gapPairV7.classList.remove('show'); gapPairV7.textContent='';
      return;
    }
    const current=gapSelected[gapSelected.length-1];
    title.textContent=current.dataset.node+' — '+current.dataset.symptom;
    body.textContent='Що перевіряємо: '+current.dataset.question;
    gapLossV7.textContent='Можлива втрата: '+current.dataset.loss;
    if(gapSelected.length===2){
      gapPairV7.textContent='Типовий розрив між функціями: '+gapSelected[0].dataset.node+' → '+gapSelected[1].dataset.node+'. На діагностиці перевіряємо, чи передаються між ними правильні дані, відповідальність і рішення.';
      gapPairV7.classList.add('show');
      track('bottleneck_pair_view',{pair:gapSelected.map(x=>x.dataset.node).join(' -> ')});
    }else{
      gapPairV7.classList.remove('show'); gapPairV7.textContent='';
    }
  };
  document.getElementById('gapCtaV10')?.addEventListener('click',()=>track('bottleneck_cta_click',{nodes:gapSelected.map(x=>x.dataset.node).join('|')}));
  gapButtons.forEach(btn=>{
    btn.setAttribute('aria-pressed','false');
    btn.addEventListener('click',()=>{
      const isOn=btn.getAttribute('aria-pressed')==='true';
      if(isOn){
        btn.setAttribute('aria-pressed','false');
        gapSelected=gapSelected.filter(x=>x!==btn);
      }else{
        if(gapSelected.length===2){
          gapSelected[0].setAttribute('aria-pressed','false');
          gapSelected.shift();
        }
        btn.setAttribute('aria-pressed','true');
        gapSelected.push(btn);
        track('bottleneck_node_view',{node:btn.dataset.node,source:'growth_map'});
      }
      renderGapV7();
    });
  });

  const processDataV6={
    1:{t:'01. Діагностика',b:'Завжди перша. Погоджуємо бізнес-ціль, аналізуємо систему й формуємо карту проблем, можливостей та план на 3–6 місяців.',g:'Після презентації плану клієнт може зупинитися й реалізовувати його самостійно або перейти з нами до реалізації.',a:'Карта стану системи + план на 3–6 місяців'},
    2:{t:'02. Реалізація плану',b:'Формуємо склад команди саме під знайдені задачі. Якщо проблема в даних — не продаємо зайве виробництво креативів. Якщо проблема в конверсії сайту — не робимо вигляд, що все вирішить ще один канал.',g:'Продовжуємо тільки ті зміни, де з’явилися валідні сигнали й економічний сенс.',a:'Backlog гіпотез + журнал рішень'},
    3:{t:'03. Постійне масштабування',b:'Збільшуємо бюджети, запускаємо нові сегменти, продукти, ринки та канали на основі того, що вже довело ефективність.',g:'Регулярно переглядаємо план, економіку й набір пріоритетів. Немає сенсу — не продовжуємо інерційно.',a:'Щомісячний огляд системи + наступні ставки'}
  };
  const pd=document.getElementById('processDetailV6');
  const renderPV6=k=>{
    const d=processDataV6[k];
    pd.innerHTML=`<h3>${d.t}</h3><p>${d.b}</p><div class="process-artifact-v10"><strong>Приклад результату етапу</strong><span>${d.a}</span><button type="button" data-process-artifact="${k}">Відкрити приклад →</button></div><div class="decision-v6"><strong>Точка рішення</strong><br>${d.g}</div><a href="#contact" class="text-link process-cta-v10">Запросити діагностику →</a>`;
    pd.querySelector('[data-process-artifact]')?.addEventListener('click',()=>track('process_artifact_open',{step:k,artifact:d.a}));
    pd.querySelector('.process-cta-v10')?.addEventListener('click',()=>track('process_cta_click',{step:k}));
    track('process_step_view',{step:k,completion_state:'view'});
  };
  document.querySelectorAll('[data-process]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-process]').forEach(x=>x.setAttribute('aria-selected','false'));
    b.setAttribute('aria-selected','true');
    renderPV6(b.dataset.process);
  }));
  renderPV6('1');


  const roleDataV6={lead:{title:'Керівник проєкту',r:'Бізнес-ціль, пріоритети, синхронізація функцій.',i:'Цілі, економіка, дані й контекст.',o:'Єдиний список пріоритетів і рішення.',k:'Бізнес-метрики та пріоритети.'},meta:{title:'Meta-спеціаліст',r:'Кампанії, бюджет, оптимізація й масштабування.',i:'Економіка, пріоритети продуктів, список креативних гіпотез.',o:'Керовані кампанії та висновки.',k:'CAC / якість ліда / маржа.'},google:{title:'Google Ads спеціаліст',r:'Search, Shopping/PMax, попит і bidding.',i:'Каталог, маржа, запити, конверсії.',o:'Структура попиту та кампанії.',k:'Економіка нового клієнта.'},analytics:{title:'Аналітик',r:'GA4/GTM, зв’язок із CRM, звітність і воронка.',i:'Дані реклами, сайту й продажів.',o:'Єдина картина для рішень.',k:'Якість і повнота вимірювання.'},creative:{title:'Креативний стратег',r:'Інсайти, меседжі, гіпотези й брифи.',i:'Аудиторія, заперечення, продукти.',o:'Список креативних гіпотез і висновки.',k:'Якість тестів та вплив на acquisition.'},cro:{title:'Спеціаліст із сайту та CRO',r:'UX, форми, оформлення замовлення, квізи та A/B-тести.',i:'Аналітика, записи поведінки користувачів і рекламні повідомлення.',o:'CRO список пріоритетів і тести.',k:'Conversion rate і втрати.'},retention:{title:'Спеціаліст із повторних продажів',r:'Частота повторних покупок, LTV, когорти та реактивація.',i:'CRM, історія покупок, сегменти.',o:'Повторні продажі план.',k:'Дохід від повторних покупок і LTV.'}};
  const roleDetailV6=document.getElementById('roleDetailV6');
  const renderRoleV6=(key)=>{
    const d=roleDataV6[key];
    track('team_role_view',{role:key,segment:sessionStorage.getItem('segment')||''});
    const syncMap={
      lead:'Щотижнева сесія з клієнтом + внутрішня синхронізація команди.',
      meta:'Спільний backlog із креативами, аналітикою та сайтом.',
      google:'Синхронізація з аналітикою, товарною матрицею та комерційними пріоритетами.',
      analytics:'Єдина логіка метрик для реклами, сайту, CRM і бізнес-рішень.',
      creative:'Регулярний цикл гіпотез → виробництво → тест → висновок.',
      cro:'Синхронізація з аналітикою, рекламою та розробкою сайту.',
      retention:'Синхронізація з CRM, продажами та економікою повторної покупки.'
    };
    roleDetailV6.innerHTML=`<h3>${d.title}</h3><div class="role-detail-grid-v6"><div class="role-mini-v6"><strong>Відповідальність</strong><span>${d.r}</span></div><div class="role-mini-v6"><strong>Що отримує</strong><span>${d.i}</span></div><div class="role-mini-v6"><strong>Що віддає</strong><span>${d.o}</span></div><div class="role-mini-v6"><strong>Що контролює</strong><span>${d.k}</span></div></div><div class="role-sync-v10"><strong>Як синхронізується</strong><span>${syncMap[key]||''}</span></div><a href="#contact" class="text-link role-cta-v10" data-team-cta="${key}">Запросити діагностику →</a>`;
    roleDetailV6.querySelector('[data-team-cta]')?.addEventListener('click',()=>track('team_cta_click',{role:key}));
  };
  document.querySelectorAll('.role-tabs-v6 button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.role-tabs-v6 button').forEach(x=>x.setAttribute('aria-selected','false'));b.setAttribute('aria-selected','true');renderRoleV6(b.dataset.role)}));renderRoleV6('lead');


  document.querySelector('[data-process-artifact="weekly_decision_log"]')?.addEventListener('click',()=>{
    const d=diagnosticPreviewV9?.artifact;
    if(d){
      modalBody.innerHTML=`<div class="eyebrow">Приклад процесу</div><h2>${d[0]}</h2><p class="modal-lead">${d[1]}</p>`;
      modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
    }
    track('process_artifact_open',{artifact:'weekly_decision_log'});
  });
  document.querySelectorAll('[data-model]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed','false'));btn.setAttribute('aria-pressed','true');document.getElementById('modelNowV6').classList.toggle('active',btn.dataset.model==='now');document.getElementById('modelOursV6').classList.toggle('active',btn.dataset.model==='ours');track?.('operating_model_toggle',{state:btn.dataset.model});}));


  const segmentDataV6={
    dental:{title:'Стоматологія та медицина',limits:'Якість лідів, довгий цикл продажу, складно пов’язати рекламу з реальним продажем обладнання або записом.',data:'CRM, статуси лідів, продажі, джерела, цикл угоди, маржа по категоріях.',roles:'Аналітика + Meta/Google + сайт/воронка + робота з продажами.',case:'Найближчий доказ: поточні e-commerce кейси. Окремий dental-кейс додамо після накопичення достатньої історії.',notFit:'Не підходимо, якщо немає системної обробки заявок або бізнес не готовий передавати статуси продажів.',recommended:['lead','meta','google','analytics','cro'],url:'dental-medical-performance/'},
    ecom:{title:'E-commerce з великим середнім чеком',limits:'Бюджет росте швидше за маржинальний результат; реклама, асортимент, сайт і повторні покупки оптимізуються окремо.',data:'Маржа, середній чек, нові й повторні клієнти, транзакції, GA4/CRM, повернення.',roles:'Meta + Google + аналітика + оптимізація конверсії + повторні продажі.',case:'Рекомендований кейс: електроніка — +93,1% доходу за 1,5 місяця.',notFit:'Не підходимо, якщо бізнес не знає маржу й не готовий її рахувати або не може забезпечити наявність товару.',recommended:['lead','meta','google','analytics','cro','retention'],url:'high-aov-ecommerce-growth/'},
    leadgen:{title:'Бізнеси з лідогенерацією',limits:'Вартість заявки виглядає нормально, але якість ліда, контактність і продаж губляться після форми.',data:'CRM, статуси, швидкість обробки, шлях від заявки до продажу, записи дзвінків або зустрічей за наявності.',roles:'Аналітика + реклама + сайт/конверсія + воронка продажів.',case:'Найближчий доказ: анонімізований кейс перебудови воронки можна додати після погодження публікації.',notFit:'Не підходимо, якщо немає менеджерів або бізнес не готовий вимірювати шлях після заявки.',recommended:['lead','meta','google','analytics','cro'],url:'lead-generation-system/'},
    market:{title:'Новий етап росту',limits:'Компанія виходить на новий ринок або запускає продукт і не знає, які важелі переносити, а що перевіряти з нуля.',data:'Початкова точка поточного ринку, економіка, продуктова матриця, попит і конкуренти.',roles:'Стратегія + платне залучення + аналітика + креативи + локалізація воронки.',case:'Рекомендований кейс: B2B косметика, Італія — ROAS 4,81 у перший місяць.',notFit:'Не підходимо, якщо вихід на новий ринок — спроба знайти попит на продукт, який ще не довів цінність на базовому ринку.',recommended:['lead','meta','google','analytics','creative','cro'],url:'market-entry-europe/'}
  };
  const segmentPanelV6=document.getElementById('segmentPanelV6');
  const roleButtonsV6=[...document.querySelectorAll('.role-tabs-v6 button')];
  const updateRecommendedRolesV6=(key)=>{
    const recommended=segmentDataV6[key]?.recommended||[];
    roleButtonsV6.forEach(btn=>btn.classList.toggle('recommended',recommended.includes(btn.dataset.role)));
  };
  const renderSegmentV6=(key,trackEvent=true)=>{
    const d=segmentDataV6[key];
    segmentPanelV6.innerHTML=`<h3>${d.title}</h3><div class="segment-mini-grid-v6"><div class="segment-mini-v6"><strong>Типові обмеження</strong><span>${d.limits}</span></div><div class="segment-mini-v6"><strong>Потрібні дані</strong><span>${d.data}</span></div><div class="segment-mini-v6"><strong>Які ролі найчастіше потрібні</strong><span>${d.roles}</span></div></div><div class="segment-case-v6">${d.case}</div><div class="segment-notFit-v6"><strong>Коли ми не підходимо:</strong> ${d.notFit}</div><p class="segment-links-v10"><a href="${d.url}" class="text-link" data-segment-page="${key}">Детальніше для цього типу бізнесу →</a><a href="#contact" class="text-link" data-segment-cta="${key}">Запросити діагностику →</a></p>`;
    sessionStorage.setItem('segment',key);
    const hidden=document.getElementById('segmentHiddenV6'); if(hidden)hidden.value=key;
    const niche=document.querySelector('[name="niche"]');
    if(niche){
      const map={dental:'Стоматологія / медицина',ecom:'E-commerce',leadgen:'Лідогенерація',market:'Інше'};
      if(!niche.value)niche.value=map[key]||'';
    }
    updateRecommendedRolesV6(key);
    const url=new URL(location.href);url.searchParams.set('segment',key);history.replaceState(null,'',url.pathname+url.search+location.hash);
    if(trackEvent)track('segment_select',{segment:key});
    document.querySelector(`[data-segment-cta="${key}"]`)?.addEventListener('click',()=>track('cta_click',{label:'Запросити діагностику для сегмента',placement:'segment',section_id:'who',segment:key}));
    document.querySelector(`[data-segment-page="${key}"]`)?.addEventListener('click',()=>track('segment_page_click',{segment:key}));
  };
  document.querySelectorAll('.segment-tab-v6').forEach(tab=>tab.addEventListener('click',()=>{
    document.querySelectorAll('.segment-tab-v6').forEach(t=>t.setAttribute('aria-selected','false'));
    tab.setAttribute('aria-selected','true');renderSegmentV6(tab.dataset.segment);
  }));
  const initialSegmentV6=new URL(location.href).searchParams.get('segment')||sessionStorage.getItem('segment')||'dental';
  const initialTabV6=document.querySelector(`.segment-tab-v6[data-segment="${initialSegmentV6}"]`);
  if(initialTabV6){
    document.querySelectorAll('.segment-tab-v6').forEach(t=>t.setAttribute('aria-selected','false'));
    initialTabV6.setAttribute('aria-selected','true');
  }
  renderSegmentV6(segmentDataV6[initialSegmentV6]?initialSegmentV6:'dental',false);
  const readinessQuestions=[
    {key:'sales',q:'У бізнесу вже є стабільні продажі?',opts:[['Так',2,'yes'],['Частково / сезонно',1,'partial'],['Ще ні',0,'no']]},
    {key:'budget',q:'Який рекламний бюджет на місяць?',opts:[['€20 000+',2,'20-50'],['€10–20 000',2,'10-20'],['€5–10 000',1,'lt10'],['До €5 000',0,'lt10']]},
    {key:'crm',q:'Є CRM або інший спосіб бачити реальні продажі після реклами?',opts:[['Так',2,'yes'],['Частково',1,'partial'],['Ні',0,'no']]},
    {key:'data',q:'Команда готова надати доступ до даних та економіки?',opts:[['Так',2,'yes'],['Частково',1,'partial'],['Ні',0,'no']]},
    {key:'change',q:'Готові змінювати не лише рекламу, а й сайт, пропозицію або процес продажу?',opts:[['Так',2,'yes'],['Залежить від аргументів',1,'partial'],['Ні',0,'no']]}
  ];
  let readIndex=0,readScore=0,readAnswers=[];
  const rq=document.getElementById('readQuestion'),ro=document.getElementById('readOptions'),rb=document.getElementById('readBar'),rs=document.getElementById('readStep'),rp=document.getElementById('readPercent'),rw=document.getElementById('readQuestionWrap'),rr=document.getElementById('readResult'),rrt=document.getElementById('readResultTitle'),rrx=document.getElementById('readResultText');
  const applyReadinessPrefillV6=()=>{
    const byKey=Object.fromEntries(readAnswers.map(x=>[x.key,x.value]));
    const budget=document.querySelector('[name="budget"]'),sales=document.querySelector('[name="stable_sales"]'),crm=document.querySelector('[name="crm_data"]');
    if(budget&&byKey.budget&&!budget.value)budget.value=byKey.budget;
    if(sales&&byKey.sales&&!sales.value)sales.value=byKey.sales;
    if(crm&&byKey.crm&&!crm.value)crm.value=byKey.crm;
  };
  const finishReadV6=()=>{
    rw.style.display='none';rr.classList.add('show');
    let result,title,body;
    if(readScore>=8){result='strong_fit';title='Формат добре підходить';body='За базовими критеріями ваш бізнес схожий на той рівень, для якого ми будуємо цей формат. Наступний крок — коротка розмова й перевірка реальної задачі.'}
    else if(readScore>=5){result='potential_fit';title='Основа є, але треба уточнити кілька речей';body='Формат може підійти, але на вступній розмові потрібно уточнити дані, бюджет або готовність команди до змін.'}
    else{result='early_stage';title='Формат може бути передчасним';body='Зараз більшу цінність може дати базова постановка аналітики, CRM або підтвердження попиту. Заявку все одно можна залишити — самоперевірка не блокує контакт.'}
    rrt.textContent=title;rrx.textContent=body;
    sessionStorage.setItem('readiness_result',result);sessionStorage.setItem('readiness_answers',JSON.stringify(readAnswers));
    const hidden=document.getElementById('readinessHiddenV6');if(hidden)hidden.value=result;
    applyReadinessPrefillV6();
    track('readiness_complete',{result,answers_summary:readAnswers.map(x=>x.score).join(',')});track('readiness_result',{result});document.querySelector('.read-result-v6 a[href="#contact"]')?.addEventListener('click',()=>track('readiness_cta_click',{result}));
  };
  const renderRead=()=>{
    const item=readinessQuestions[readIndex];rq.textContent=item.q;ro.innerHTML='';
    item.opts.forEach(([label,score,value])=>{
      const b=document.createElement('button');b.className='read-option-v6';b.type='button';b.textContent=label;
      b.onclick=()=>{
        if(readIndex===0)track('readiness_start',{});
        readScore+=score;readAnswers.push({key:item.key,q:item.q,a:label,score,value});
        track('readiness_answer',{step:readIndex+1,answer:label});
        readIndex++;
        if(readIndex<readinessQuestions.length){
          rs.textContent=readIndex+1;const pct=(readIndex+1)*20;rp.textContent=pct+'%';rb.style.width=pct+'%';renderRead();
        }else finishReadV6();
      };
      ro.appendChild(b);
    });
  };
  const savedReadinessV6=sessionStorage.getItem('readiness_result');
  if(savedReadinessV6){
    try{readAnswers=JSON.parse(sessionStorage.getItem('readiness_answers')||'[]');readScore=readAnswers.reduce((s,x)=>s+(x.score||0),0);finishReadV6()}catch(e){renderRead()}
  }else renderRead();


  const topProgress=document.getElementById('topProgress');
  addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;topProgress.style.width=(max>0?scrollY/max*100:0)+'%';},{passive:true});
  const heroSystem=document.getElementById('heroSystem'),heroTip=document.getElementById('heroSystemTip');
  heroSystem?.querySelectorAll('.hero-system-node').forEach(node=>{const show=()=>{heroTip.textContent=node.dataset.tip;heroSystem.classList.add('show-tip');track('hero_system_node_view',{node:node.textContent.trim()});};node.addEventListener('mouseenter',show);node.addEventListener('focus',show);node.addEventListener('click',show);node.addEventListener('mouseleave',()=>heroSystem.classList.remove('show-tip'));});
  document.querySelectorAll('[data-scroll-case]').forEach(a=>a.addEventListener('click',()=>document.getElementById('proof')?.scrollIntoView()));


  const menuBtn=document.getElementById('menuBtn');
  const navLinks=document.querySelector('.nav-links');
  menuBtn.addEventListener('click',()=>{
    const open=navLinks.style.display==='flex';
    navLinks.style.display=open?'none':'flex';
    if(!open){
      Object.assign(navLinks.style,{
        position:'fixed',left:'10px',right:'10px',top:'68px',padding:'10px',
        background:'#eef5ff',border:'1px solid #c9dcf1',borderRadius:'14px',
        flexDirection:'column',alignItems:'stretch',zIndex:'120'
      });
    }
  });

  const revealObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('on');revealObs.unobserve(e.target)}
    })
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

  // Умовна анімація "перша стеля → команда підхоплює → далі ріст"
  const meter=document.getElementById('meterCard');
  const needle=document.getElementById('needle');
  const meterValue=document.getElementById('meterValue');
  const meterState=document.getElementById('meterState');
  let meterPlayed=false;
  const angle=v=>-88+(176*v/100);
  const counter=(from,to,duration)=>{
    const start=performance.now();
    const tick=now=>{
      const p=Math.min((now-start)/duration,1);
      const e=1-Math.pow(1-p,3);
      meterValue.textContent=Math.round(from+(to-from)*e);
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const playMeter=()=>{
    if(meterPlayed)return;
    meterPlayed=true;
    meter.classList.add('phase1');
    needle.style.transform=`rotate(${angle(20)}deg)`;
    counter(0,20,850);
    setTimeout(()=>{
      meter.classList.add('phase2');
      needle.style.transform=`rotate(${angle(82)}deg)`;
      counter(20,82,1250);
      meterState.textContent='коли всі напрями працюють як одна система';
    },1300);
  };
  const meterObs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){playMeter();meterObs.disconnect()}
  },{threshold:.35});
  meterObs.observe(meter);

  const cases={
    zhuk:{
      label:"E-commerce / електроніка / Україна",
      title:"Як фокус на 100–150 товарах перетворив Meta на керований канал",
      lead:"Великий e-commerce приблизно зі 100 000 товарів витрачав бюджет у Meta, але канал працював близько до нульової рентабельності.",
      metrics:[["−26,9%","вартість транзакції"],["+50,4%","конверсія"],["+93,1%","дохід"],["1,5 міс.","до результату"]],
      sections:[
        ["Що побачили","Проблема була не тільки в аудиторіях чи креативах. Реклама намагалася продавати надто широкий каталог, а рекламні пріоритети не були синхронізовані з комерційними."],
        ["Що змінили","Разом із комерційним відділом визначили 4 пріоритетні категорії та 100–150 товарів за маржинальністю, наявністю, ціною, сезонністю й потенціалом попиту. Перебудували кампанії та креативи."],
        ["Результат","За 1,5 місяця вартість транзакції знизилась на 26,9%, конверсія виросла на 50,4%, а дохід — на 93,1%."]
      ]
    },
    iphone:{
      label:"Б/У iPhone / стратегія аудиторії",
      title:"Як аналіз фактичних покупців дав ×5 до суми продажів Б/У iPhone",
      lead:"Задача — масштабувати категорію Б/У iPhone без повної перебудови рекламної системи.",
      metrics:[["×5","сума продажів"],["≈₴1 млн","дохід"],["+30%","ROAS"],["1,5 міс.","період"]],
      sections:[
        ["Що побачили","Історичні продажі показали, що основний попит приходив не з найбільших міст, а з невеликих міст і селищ, де бренд мав сильну офлайн-присутність."],
        ["Що змінили","Сфокусували рекламу на невеликих містах біля офлайн-магазинів. У креативах підсилювали доступність Б/У iPhone, оплату частинами, гарантії та можливість оглянути товар."],
        ["Результат","За 1,5 місяця сума продажів категорії зросла у п’ять разів — приблизно до 1 млн грн, а ROAS підвищився на 30%."]
      ]
    },
    italy:{
      label:"B2B косметика / Італія",
      title:"ROAS 4,81 у перший місяць для B2B-магазину косметики",
      lead:"Інтернет-магазин косметики та обладнання для майстрів манікюру виходив у платне залучення клієнтів на ринку Італії.",
      metrics:[["€879,79","витрати на рекламу"],["74","оплачені продажі"],["€11,8","вартість продажу"],["4,81","ROAS"]],
      sections:[
        ["Підготовка","За п’ять робочих днів сегментували холодні, теплі й гарячі аудиторії та визначили пріоритетні продуктові категорії."],
        ["Що тестували","Для категорій створили окремі товарні набори та протестували каталоги, статичні й відеокреативи в різних зв’язках."],
        ["Результат","У перший місяць витрачено €879,79, отримано 74 оплачені продажі, €4 234,33 доходу та ROAS 4,81."]
      ]
    }
  };

  const modal=document.getElementById('modal');
  const modalBody=document.getElementById('modalBody');
  const closeBtn=document.getElementById('close');

  document.querySelectorAll('[data-case]').forEach(card=>{
    card.addEventListener('click',()=>{
      const d=cases[card.dataset.case];
      modalBody.innerHTML=`
        <div class="eyebrow">${d.label}</div>
        <h2>${d.title}</h2>
        <p class="modal-lead">${d.lead}</p>
        <div class="modal-metrics">
          ${d.metrics.map(x=>`<div class="modal-metric"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}
        </div>
        ${d.sections.map(x=>`<div class="modal-section"><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join('')}
      `;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      document.body.classList.add('modal-open');
    });
  });

  document.querySelectorAll('[data-open-case]').forEach(btn=>btn.addEventListener('click',()=>{const d=cases[btn.dataset.openCase];modalBody.innerHTML=`<div class="eyebrow">${d.label}</div><h2>${d.title}</h2><p class="modal-lead">${d.lead}</p><div class="modal-metrics">${d.metrics.map(x=>`<div class="modal-metric"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div>${d.sections.map(x=>`<div class="modal-section"><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join('')}`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');track('case_open',{case_id:btn.dataset.openCase,source:'preview'});}));
  
  document.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{
    const d=diagnosticPreviewV9[btn.dataset.preview];
    if(!d)return;
    modalBody.innerHTML=`<div class="eyebrow">Приклад результату</div><h2>${d[0]}</h2><p class="modal-lead">${d[1]}</p>`;
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
    track('diagnostic_preview_open',{artifact_id:btn.dataset.preview});
  }));
  document.querySelectorAll('[data-diagnostic-step]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-diagnostic-step]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    track('diagnostic_timeline_step',{step:btn.dataset.diagnosticStep});
  }));
  const diagScopeV10=document.querySelector('.diagnostic-price-v6');
  if(diagScopeV10){
    let scopeSeen=false;
    new IntersectionObserver(e=>{if(e[0].isIntersecting&&!scopeSeen){scopeSeen=true;track('diagnostic_scope_view',{price_from:'4500_eur'});}}, {threshold:.8}).observe(diagScopeV10);
  }
  document.querySelector('[data-diagnostic-cta]')?.addEventListener('click',()=>{
    sessionStorage.setItem('lead_intent','diagnostic');
    track('diagnostic_cta_click',{placement:'diagnostic'});
  });

  const diagnosticPreviewV9={artifact:['Приклад журналу рішень','Прототип структури: проблема → дані → гіпотеза → пріоритет → дія → результат → рішення. Перед фінальним релізом замінити на реальний анонімізований артефакт.'],health:['Карта стану системи','Що працює, де ризик, де потенційна можливість. Це структурний приклад; у фінальній версії тут має бути реальний анонімізований фрагмент.'],opportunity:['Карта можливостей','Кожну можливість оцінюємо за впливом, складністю, швидкістю, ресурсом і ризиком.'],priority:['Пріоритети','Не 50 рекомендацій, а короткий список: що виправити зараз, що масштабувати, що протестувати і що не чіпати.'],план:['План на 3–6 місяців','Для ініціативи: проблема, гіпотеза, дія, метрика, відповідальний, ресурс, залежності, критерій успіху та зупинки.']};
  

  const closeModal=()=>{
    modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')
  };
  closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});


  document.querySelectorAll('.faq-question').forEach(button=>{
    button.addEventListener('click',()=>{
      const item=button.closest('.faq-item');
      const answer=item.querySelector('.faq-answer');
      const open=item.classList.toggle('open');
      button.setAttribute('aria-expanded',String(open));
      answer.style.maxHeight=open?answer.scrollHeight+'px':'0px';
      if(open && item.id){
        history.replaceState(null,'',location.pathname+location.search+'#'+item.id);
      }
    });
  });

  const params=new URLSearchParams(location.search);
  ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(key=>{const input=document.querySelector(`[name="${key}"]`);if(input)input.value=params.get(key)||""});
  const segmentHiddenV6=document.getElementById('segmentHiddenV6'),readinessHiddenV6=document.getElementById('readinessHiddenV6');if(segmentHiddenV6)segmentHiddenV6.value=sessionStorage.getItem('segment')||'';if(readinessHiddenV6)readinessHiddenV6.value=sessionStorage.getItem('readiness_result')||'';
  
  const getQualificationBandV9=(data)=>{
    if(data.readiness_result)return data.readiness_result;
    let score=0;
    if(['10-20','20-50','50plus'].includes(data.budget))score+=2;
    else if(data.budget==='lt10')score+=0;
    if(data.stable_sales==='yes')score+=2; else if(data.stable_sales==='partial')score+=1;
    if(data.crm_data==='yes')score+=2; else if(data.crm_data==='partial')score+=1;
    return score>=5?'strong_fit':score>=3?'potential_fit':'early_stage';
  };

  
  const submissionInputV10=document.getElementById('submissionIdV10');
  if(submissionInputV10){
    let sid=sessionStorage.getItem('lead_submission_id');
    if(!sid){sid=crypto.randomUUID?crypto.randomUUID():'sub_'+Date.now()+'_'+Math.random().toString(36).slice(2);sessionStorage.setItem('lead_submission_id',sid);}
    submissionInputV10.value=sid;
  }
  const leadIntentV10=document.getElementById('leadIntentV10');
  if(leadIntentV10)leadIntentV10.value=sessionStorage.getItem('lead_intent')||'';

  const form=document.getElementById('leadForm'),formSteps=[...form.querySelectorAll('.form-step-v6')],formBars=[...form.querySelectorAll('.form-progress-v6 span')],status=document.getElementById('status');let formStep=0,formStarted=false;
  const saveForm=()=>{const o={};new FormData(form).forEach((v,k)=>{if(!['consent','website_confirm'].includes(k))o[k]=v});sessionStorage.setItem('leadForm',JSON.stringify(o))};const saved=JSON.parse(sessionStorage.getItem('leadForm')||'{}');Object.entries(saved).forEach(([k,v])=>{const el=form.elements[k];if(el&&!el.value)el.value=v});
  const showFormStep=i=>{
      formStep=i;
      formSteps.forEach((s,n)=>s.classList.toggle('active',n===i));
      formBars.forEach((b,n)=>b.classList.toggle('active',n<=i));
      const progress=document.getElementById('formProgressV9');
      if(progress){
        progress.setAttribute('aria-valuenow',String(i+1));
        progress.setAttribute('aria-label',`Крок ${i+1} з 3`);
      }
      track('form_step_view',{step:i+1,completion_state:'view'});
    };
  const validateFormStep=i=>{
      let ok=true;
      formSteps[i].querySelectorAll('[required]').forEach(el=>{
        const error=document.getElementById(el.getAttribute('aria-describedby')||'');
        if(!el.checkValidity()){
          ok=false;el.setAttribute('aria-invalid','true');
          if(error)error.textContent=el.validity.valueMissing?'Заповніть це поле.':'Перевірте формат поля.';
          track('form_field_error',{field:el.name,error_type:el.validity.valueMissing?'required':'invalid',step:i+1});
        }else{
          el.removeAttribute('aria-invalid');if(error)error.textContent='';
        }
      });
      if(!ok)formSteps[i].querySelector('[aria-invalid="true"]')?.focus();
      return ok;
    };
  form.addEventListener('input',()=>{if(!formStarted){formStarted=true;track('form_start',{form_id:'diagnostic',source:'landing'})}saveForm()});form.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{if(validateFormStep(formStep))showFormStep(Math.min(formStep+1,2))}));form.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>{track('form_back',{step:formStep+1});showFormStep(Math.max(formStep-1,0))}));
  form.addEventListener('submit',async e=>{e.preventDefault();syncCasesViewedV8();if(!validateFormStep(2)||form.website_confirm.value)return;const data=Object.fromEntries(new FormData(form).entries());data.page_url=location.href;data.referrer=document.referrer||'';data.readiness_answers=sessionStorage.getItem('readiness_answers')||'';data.submitted_at=new Date().toISOString();const qualificationBandV9=getQualificationBandV9(data);track('form_submit',{form_id:'diagnostic',qualification_band:qualificationBandV9,segment:data.segment||'',budget_band:data.budget||'',crm_state:data.crm_data||''});const btn=form.querySelector('[type="submit"]');btn.disabled=true;btn.textContent='Надсилаємо...';try{if(!FORM_ENDPOINT){await new Promise(r=>setTimeout(r,300));status.classList.add('show');status.textContent='Форма працює в режимі прототипу. Перед публічним запуском потрібно підключити захищену відправку в CRM, серверну перевірку, антиспам і фінальний сценарій згоди.';}else{const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw new Error();status.classList.add('show');status.textContent='Дякуємо. Заявку надіслано.';track('form_success',{lead_id_hash:'server_generated',qualification_band:qualificationBandV9});sessionStorage.removeItem('leadForm')}}catch{status.classList.add('show');status.textContent='Не вдалося надіслати. Дані збережено — спробуйте ще раз або напишіть у Telegram.';track('form_failure',{form_id:'diagnostic'})}finally{btn.disabled=false;btn.textContent='Надіслати заявку'}});showFormStep(0);
  