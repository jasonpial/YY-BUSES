(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const d of e)if(d.type==="childList")for(const p of d.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&l(p)}).observe(document,{childList:!0,subtree:!0});function r(e){const d={};return e.integrity&&(d.integrity=e.integrity),e.referrerPolicy&&(d.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?d.credentials="include":e.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function l(e){if(e.ep)return;e.ep=!0;const d=r(e);fetch(e.href,d)}})();const X="yy_buses_system_state_v1",re=[{id:"kla",name:"Kampala",code:"KLA",ticketPrice:3e4,courierBase:1e4,courierPerKg:1500},{id:"mbl",name:"Mbale",code:"MBL",ticketPrice:35e3,courierBase:12e3,courierPerKg:1800},{id:"srt",name:"Soroti",code:"SRT",ticketPrice:4e4,courierBase:15e3,courierPerKg:2e3},{id:"lra",name:"Lira",code:"LRA",ticketPrice:45e3,courierBase:18e3,courierPerKg:2200},{id:"glu",name:"Gulu",code:"GLU",ticketPrice:45e3,courierBase:18e3,courierPerKg:2200},{id:"jja",name:"Jinja",code:"JJA",ticketPrice:15e3,courierBase:6e3,courierPerKg:1e3},{id:"iga",name:"Iganga",code:"IGA",ticketPrice:2e4,courierBase:8e3,courierPerKg:1200},{id:"trr",name:"Tororo",code:"TRR",ticketPrice:3e4,courierBase:1e4,courierPerKg:1500}],ie=[{id:"bus-01",regNo:"UBE 102Y",model:"Scania F310 (67 Seater)",capacity:67,status:"Active"},{id:"bus-02",regNo:"UBF 455X",model:"Yutong ZK6122H (67 Seater)",capacity:67,status:"Active"},{id:"bus-03",regNo:"UBG 789B",model:"Scania F310 (67 Seater)",capacity:67,status:"Active"},{id:"bus-04",regNo:"UBH 220Z",model:"Yutong ZK6122H (67 Seater)",capacity:67,status:"Active"},{id:"bus-05",regNo:"UBJ 304K",model:"Scania F310 (67 Seater)",capacity:67,status:"Maintenance"},{id:"bus-06",regNo:"UBK 911F",model:"Yutong ZK6122H (67 Seater)",capacity:67,status:"Active"}],ne={drivers:[{id:"drv-01",name:"Okello John Bosco",phone:"+256 772 123456",license:"DL78291X",status:"Available"},{id:"drv-02",name:"Mugisha Ronald",phone:"+256 701 987654",license:"DL65192B",status:"Available"},{id:"drv-03",name:"Wanyama Godfrey",phone:"+256 781 456789",license:"DL89021C",status:"On Duty"},{id:"drv-04",name:"Otim Peter",phone:"+256 755 321098",license:"DL43210M",status:"Available"},{id:"drv-05",name:"Ssewankambo Yusuf",phone:"+256 779 881122",license:"DL11294K",status:"Available"}],conductors:[{id:"cnd-01",name:"Nsubuga David",phone:"+256 774 234567",badge:"CND-882",status:"Available"},{id:"cnd-02",name:"Akello Sarah",phone:"+256 703 112233",badge:"CND-409",status:"Available"},{id:"cnd-03",name:"Chemutai Alex",phone:"+256 788 556677",badge:"CND-152",status:"On Duty"},{id:"cnd-04",name:"Atwine Brenda",phone:"+256 752 443322",badge:"CND-762",status:"Available"},{id:"cnd-05",name:"Kaganda Moses",phone:"+256 712 990088",badge:"CND-305",status:"Available"}]},V=(b,a)=>{const r={},l=["Kato Ivan","Namubiru Sylvia","Onyango Emmanuel","Aisha Kemigisa","Musoke Fred","Alupo Agnes","Chelimo Mercy","Mwebaze Moses","Alowo Rebecca","Odongo Francis","Aceng Beatrice","Mukasa Arthur","Kizza Patrick","Namatovu Florence","Ssemwanga Timothy"],e=["+256 782 112233","+256 773 445566","+256 701 556677","+256 752 998877","+256 779 123456","+256 704 654321"];for(let d=0;d<b;d++){const p=Math.floor(Math.random()*60)+1;if(!r[p]){const c=`YY-TKT-${Math.floor(1e5+Math.random()*9e5)}`;r[p]={ticketId:c,seatNo:p,passengerName:l[Math.floor(Math.random()*l.length)],passengerPhone:e[Math.floor(Math.random()*e.length)],amountPaid:a,purchaseDate:new Date(Date.now()-Math.random()*24*3600*1e3).toISOString(),status:"CheckedIn"}}}return r},oe=[{id:"jny-001",busId:"bus-01",routeFrom:"Kampala",routeTo:"Mbale",driverId:"drv-03",conductorId:"cnd-03",departureTime:new Date(Date.now()-3*3600*1e3).toISOString(),status:"In Transit",progress:75,currentLocation:"Iganga",routePath:["Kampala","Jinja","Iganga","Mbale"],tickets:V(38,35e3),expenses:[{id:"exp-01",category:"Fuel",description:"Initial fuel Kampala shell",amount:18e4,time:new Date(Date.now()-4*3600*1e3).toISOString()},{id:"exp-02",category:"Police/Tolls",description:"Jinja bridge toll",amount:1e4,time:new Date(Date.now()-2*3600*1e3).toISOString()},{id:"exp-03",category:"Meals",description:"Driver & Conductor lunch Namawojjolo",amount:25e3,time:new Date(Date.now()-2.5*3600*1e3).toISOString()}],cargo:[{id:"crg-01",description:"Bag of Mbale Coffee Beans (Commercial)",weightKg:50,chargeUGX:2e4,status:"Loaded"},{id:"crg-02",description:"Plastic crate of electronics",weightKg:15,chargeUGX:12e3,status:"Loaded"}]},{id:"jny-002",busId:"bus-02",routeFrom:"Kampala",routeTo:"Soroti",driverId:"drv-01",conductorId:"cnd-01",departureTime:new Date(Date.now()+2*3600*1e3).toISOString(),status:"Scheduled",progress:0,currentLocation:"Kampala Terminal",routePath:["Kampala","Jinja","Iganga","Mbale","Kumi","Soroti"],tickets:V(12,4e4),expenses:[],cargo:[]},{id:"jny-003",busId:"bus-04",routeFrom:"Lira",routeTo:"Kampala",driverId:"drv-02",conductorId:"cnd-02",departureTime:new Date(Date.now()-10*3600*1e3).toISOString(),status:"Completed",progress:100,currentLocation:"Kampala Terminal",routePath:["Lira","Kaberamaido","Soroti","Mbale","Iganga","Jinja","Kampala"],tickets:V(58,45e3),expenses:[{id:"exp-04",category:"Fuel",description:"Fuel in Lira",amount:2e5,time:new Date(Date.now()-11*3600*1e3).toISOString()},{id:"exp-05",category:"Maintenance",description:"Flat tire patch at Soroti",amount:15e3,time:new Date(Date.now()-7*3600*1e3).toISOString()},{id:"exp-06",category:"Police/Tolls",description:"Highway traffic clearing",amount:2e4,time:new Date(Date.now()-5*3600*1e3).toISOString()}],cargo:[{id:"crg-03",description:"Baskets of smoked fish",weightKg:30,chargeUGX:15e3,status:"Delivered"}]}],de=[{id:"YY-PRC-492810",senderName:"Opio Samuel",senderPhone:"+256 772 901827",receiverName:"Akwero Beatrice",receiverPhone:"+256 701 443322",routeFrom:"Kampala",routeTo:"Soroti",weightKg:8.5,dimensions:"30x30x20 cm",description:"Academic documents & laptop charger",priceUGX:27e3,status:"Intake",journeyId:null,history:[{status:"Intake",time:new Date(Date.now()-2*3600*1e3).toISOString(),description:"Package checked in at Kampala Office by Handler Brenda"}],createdDate:new Date(Date.now()-2*3600*1e3).toISOString()},{id:"YY-PRC-881920",senderName:"Namaganda Proscovia",senderPhone:"+256 788 112299",receiverName:"Mukasa Ronald",receiverPhone:"+256 754 887766",routeFrom:"Kampala",routeTo:"Mbale",weightKg:22,dimensions:"50x50x50 cm large box",description:"Personal effects & clothing bag",priceUGX:51600,status:"Dispatched",journeyId:"jny-001",history:[{status:"Intake",time:new Date(Date.now()-5*3600*1e3).toISOString(),description:"Checked in at Kampala Terminal"},{status:"Dispatched",time:new Date(Date.now()-3*3600*1e3).toISOString(),description:"Loaded on Bus UBE 102Y departing for Mbale"}],createdDate:new Date(Date.now()-5*3600*1e3).toISOString()},{id:"YY-PRC-109283",senderName:"Kimbugwe Fred",senderPhone:"+256 775 889900",receiverName:"Malinga Moses",receiverPhone:"+256 777 665544",routeFrom:"Kampala",routeTo:"Mbale",weightKg:2,dimensions:"Envelop small",description:"Land Title Deeds & Birth Certificates",priceUGX:15600,status:"Arrived",journeyId:null,history:[{status:"Intake",time:new Date(Date.now()-24*3600*1e3).toISOString(),description:"Checked in at Kampala Terminal"},{status:"Dispatched",time:new Date(Date.now()-20*3600*1e3).toISOString(),description:"Loaded on Bus UBF 455X"},{status:"Arrived",time:new Date(Date.now()-15*3600*1e3).toISOString(),description:"Arrived at Mbale Office. Awaiting collection."}],createdDate:new Date(Date.now()-24*3600*1e3).toISOString()},{id:"YY-PRC-772619",senderName:"Lanyero Christine",senderPhone:"+256 782 554433",receiverName:"Odoch Patrick",receiverPhone:"+256 703 998811",routeFrom:"Gulu",routeTo:"Kampala",weightKg:12,dimensions:"Medium bag",description:"Fresh shea butter cosmetic tubs",priceUGX:44400,status:"Collected",journeyId:null,history:[{status:"Intake",time:new Date(Date.now()-48*3600*1e3).toISOString(),description:"Received in Gulu"},{status:"Dispatched",time:new Date(Date.now()-44*3600*1e3).toISOString(),description:"Dispatched on Bus UBJ 304K"},{status:"Arrived",time:new Date(Date.now()-36*3600*1e3).toISOString(),description:"Arrived at Kampala Depot"},{status:"Collected",time:new Date(Date.now()-30*3600*1e3).toISOString(),description:"Collected by Odoch Patrick. ID verified."}],createdDate:new Date(Date.now()-48*3600*1e3).toISOString()}],le=()=>{const b=localStorage.getItem(X);if(b)try{return JSON.parse(b)}catch(r){console.error("Failed to parse cached state",r)}const a={destinations:re,buses:ie,staff:ne,journeys:oe,parcels:de};return localStorage.setItem(X,JSON.stringify(a)),a},ce=()=>le(),pe=b=>{localStorage.setItem(X,JSON.stringify(b));const a=new CustomEvent("yy_state_changed",{detail:b});window.dispatchEvent(a)},E=b=>b==null?"UGX 0":"UGX "+Math.round(b).toLocaleString("en-UG"),_=(b="YY",a=6)=>{const r="0123456789";let l="";for(let e=0;e<a;e++)l+=r.charAt(Math.floor(Math.random()*r.length));return`${b}-${l}`},K=b=>{if(!b)return"";const a=new Date(b),r=new Date,l={month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"};if(a.toDateString()===r.toDateString())return`Today at ${a.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1})}`;const e=new Date(r);return e.setDate(r.getDate()-1),a.toDateString()===e.toDateString()?`Yesterday at ${a.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1})}`:a.toLocaleDateString("en-US",l)},Q=(b,a,r,l=!1,e="medium")=>{let c=a+b*r;return e==="small"&&(c*=.9),e==="large"&&(c*=1.25),e==="extra-large"&&(c*=1.6),l&&(c+=5e3),Math.ceil(c/100)*100},ue=b=>{const a=b.split("").reduce((e,d)=>e+d.charCodeAt(0),0);let r=10,l="";for(let e=0;e<40;e++){const d=(a+e)%3+1,p=a*(e+1)%4+1;(a+e)%2===0?(l+=`<rect x="${r}" y="10" width="${d}" height="50" fill="black" />`,r+=d+p):r+=p}return`
    <svg width="220" height="80" viewBox="0 0 ${r+10} 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white" />
      ${l}
      <text x="50%" y="72" font-family="'Inter', sans-serif" font-size="10" text-anchor="middle" fill="black" letter-spacing="2">${b}</text>
    </svg>
  `},me=b=>{let a=5381;for(let c=0;c<b.length;c++)a=(a<<5)+a+b.charCodeAt(c);const r=15,l=10,e=6,d=r*e+l*2;let p="";p+=`<rect x="${l}" y="${l}" width="${7*e}" height="${7*e}" fill="#7a0016" />`,p+=`<rect x="${l+e}" y="${l+e}" width="${5*e}" height="${5*e}" fill="white" />`,p+=`<rect x="${l+e*2}" y="${l+e*2}" width="${3*e}" height="${3*e}" fill="#7a0016" />`,p+=`<rect x="${l+(r-7)*e}" y="${l}" width="${7*e}" height="${7*e}" fill="#7a0016" />`,p+=`<rect x="${l+(r-6)*e}" y="${l+e}" width="${5*e}" height="${5*e}" fill="white" />`,p+=`<rect x="${l+(r-5)*e}" y="${l+e*2}" width="${3*e}" height="${3*e}" fill="#7a0016" />`,p+=`<rect x="${l}" y="${l+(r-7)*e}" width="${7*e}" height="${7*e}" fill="#7a0016" />`,p+=`<rect x="${l+e}" y="${l+(r-6)*e}" width="${5*e}" height="${5*e}" fill="white" />`,p+=`<rect x="${l+e*2}" y="${l+(r-5)*e}" width="${3*e}" height="${3*e}" fill="#7a0016" />`;for(let c=0;c<r;c++)for(let g=0;g<r;g++){if(c<8&&g<8||c<8&&g>=r-8||c>=r-8&&g<8)continue;const v=Math.sin(a+c*13+g*37)*1e4;if(v-Math.floor(v)>.45){const I=l+g*e,C=l+c*e;p+=`<rect x="${I}" y="${C}" width="${e}" height="${e}" fill="#1a365d" />`}}return`
    <svg width="110" height="110" viewBox="0 0 ${d} ${d}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white" rx="4" />
      ${p}
    </svg>
  `};function Z(b,a,r){const l=a.journeys.filter(g=>g.status==="In Transit").length,e=a.journeys.filter(g=>g.status==="Scheduled").length,d=a.parcels.filter(g=>g.status==="Intake").length,p=a.parcels.filter(g=>g.status==="Dispatched").length,c=a.buses.length;b.innerHTML=`
    <div class="portal-container" style="max-width: 1100px; margin: 0 auto; padding: 2rem 0;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 style="font-size: 2.8rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary-maroon); margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          YY BUSES UGANDA
        </h2>
        <p style="font-size: 1.15rem; color: var(--text-medium); max-width: 600px; margin: 0 auto; font-weight: 500;">
          Welcome to the Integrated Transport & Courier Management Platform. Choose a system module to get started.
        </p>
      </div>

      <!-- Quick Live Stats Panel -->
      <div class="stats-grid" style="margin-bottom: 3rem;">
        <div class="stat-card" style="border-left: 4px solid var(--primary-blue);">
          <div class="stat-icon blue">🚌</div>
          <div class="stat-info">
            <span class="stat-label">Active Journeys</span>
            <span class="stat-value">${l}</span>
            <span class="stat-trend trend-up">▲ Live Tracking</span>
          </div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--primary-maroon);">
          <div class="stat-icon maroon">📦</div>
          <div class="stat-info">
            <span class="stat-label">Parcels at Terminal</span>
            <span class="stat-value">${d}</span>
            <span class="stat-trend trend-up">▲ Awaiting Dispatch</span>
          </div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--success);">
          <div class="stat-icon success">🚚</div>
          <div class="stat-info">
            <span class="stat-label">Parcels in Transit</span>
            <span class="stat-value">${p}</span>
            <span class="stat-trend trend-up">▲ En Route</span>
          </div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--info);">
          <div class="stat-icon info">📋</div>
          <div class="stat-info">
            <span class="stat-label">Scheduled Today</span>
            <span class="stat-value">${e}</span>
            <span class="stat-trend" style="color: var(--text-light)">Total fleet size: ${c}</span>
          </div>
        </div>
      </div>

      <div class="portal-grid">
        <!-- Transportation Operations Panel -->
        <div class="portal-panel blue">
          <div class="portal-icon blue">🚌</div>
          <h3 style="font-size: 1.6rem; color: var(--primary-blue); font-weight: 700;">Bus Transport Section</h3>
          <p style="color: var(--text-medium); font-size: 0.95rem; min-height: 48px;">
            Manage passenger ticket bookings, load undercarriage cargo, track route progression, log conductor expenses, and oversee financials.
          </p>
          <div class="role-selector">
            <button class="btn btn-blue btn-block" id="btn-bus-handler">
              🎟️ Ticketing & Dispatch (Handler)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-bus-conductor" style="border-color: var(--primary-blue-light); color: var(--primary-blue);">
              📱 Journey Logs & Expenses (Conductor)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-bus-manager" style="border-color: var(--primary-blue-light); color: var(--primary-blue);">
              📊 Fleet Analytics & Live Map (Manager)
            </button>
          </div>
        </div>

        <!-- Courier Operations Panel -->
        <div class="portal-panel maroon">
          <div class="portal-icon maroon">📦</div>
          <h3 style="font-size: 1.6rem; color: var(--primary-maroon); font-weight: 700;">Courier & Parcel Section</h3>
          <p style="color: var(--text-medium); font-size: 0.95rem; min-height: 48px;">
            Calculate delivery costs, intake client packages, print labels with barcode tracking, assign to transit buses, and check out deliveries.
          </p>
          <div class="role-selector">
            <button class="btn btn-maroon btn-block" id="btn-courier-client">
              🔍 Track & Pre-Book Parcel (Client)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-courier-handler" style="border-color: var(--primary-maroon-light); color: var(--primary-maroon);">
              📥 Parcel Intake & Dispatch (Handler)
            </button>
            <button class="btn btn-secondary btn-block" id="btn-courier-admin" style="border-color: var(--primary-maroon-light); color: var(--primary-maroon);">
              📊 Pricing & Package Audits (Admin)
            </button>
          </div>
        </div>
      </div>

      <!-- Public Info Banner -->
      <div style="margin-top: 3rem; text-align: center;">
        <button class="btn btn-secondary" id="btn-destinations-pricing" style="padding: 12px 24px;">
          🗺️ View Public Destinations & Pricing Directory
        </button>
      </div>
    </div>
  `,document.getElementById("btn-bus-handler").addEventListener("click",()=>r("bus-handler")),document.getElementById("btn-bus-conductor").addEventListener("click",()=>r("bus-conductor")),document.getElementById("btn-bus-manager").addEventListener("click",()=>r("bus-manager")),document.getElementById("btn-courier-client").addEventListener("click",()=>r("courier-client")),document.getElementById("btn-courier-handler").addEventListener("click",()=>r("courier-handler")),document.getElementById("btn-courier-admin").addEventListener("click",()=>r("courier-admin")),document.getElementById("btn-destinations-pricing").addEventListener("click",()=>r("destinations"))}function ge(b,a,r){b.innerHTML=`
    <div class="destinations-hero">
      <h2>Routes & Pricing Directory</h2>
      <p>Official schedules, passenger fares, and parcel delivery rates for YY Buses Uganda</p>
    </div>

    <div class="grid-2">
      <!-- Destinations List -->
      <div class="card">
        <div class="card-title-bar">
          <h3 style="color: var(--primary-blue)">📍 Active Stations & Rates</h3>
          <span class="badge badge-blue">8 Hubs</span>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Code</th>
                <th>Passenger Fare</th>
                <th>Courier Base</th>
                <th>Per Kg Rate</th>
              </tr>
            </thead>
            <tbody id="destinations-list-tbody">
              ${a.destinations.map(v=>`
                <tr>
                  <td><strong>Kampala to ${v.name}</strong></td>
                  <td><span class="badge badge-secondary">${v.code}</span></td>
                  <td style="font-weight: 600; color: var(--primary-blue);">${E(v.ticketPrice)}</td>
                  <td>${E(v.courierBase)}</td>
                  <td style="color: var(--text-medium); font-size: 0.85rem;">+${E(v.courierPerKg)} / kg</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Live Pricing Calculator -->
      <div class="card calculator-card">
        <div class="card-title-bar">
          <h3 style="color: var(--primary-maroon)">📦 Parcel Cost Calculator</h3>
          <span class="badge badge-maroon">Quick Estimate</span>
        </div>
        
        <form id="calc-form">
          <div class="form-group">
            <label for="calc-route">Select Route (From Kampala to)</label>
            <select id="calc-route" required>
              ${a.destinations.map(v=>`<option value="${v.id}">${v.name}</option>`).join("")}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="calc-weight">Package Weight (kg)</label>
              <input type="number" id="calc-weight" min="0.1" step="0.1" value="2.0" required>
            </div>

            <div class="form-group">
              <label for="calc-size">Approx. Size</label>
              <select id="calc-size">
                <option value="small">Small (Envelope / Document pouch)</option>
                <option value="medium" selected>Medium (Shoebox / Laptop bag)</option>
                <option value="large">Large (Suitcase / Large sack)</option>
                <option value="extra-large">Extra Large (Undercarriage commercial sack)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
            <input type="checkbox" id="calc-fragile" style="width: auto; margin-right: 6px; cursor: pointer;">
            <label for="calc-fragile" style="margin-bottom: 0; cursor: pointer;">Requires Fragile/Special Handling (+${E(5e3)})</label>
          </div>

          <div id="calc-result" style="margin-top: 1.5rem; padding: 1rem; border-radius: var(--border-radius-md); background: var(--primary-maroon-light); border: 1px solid rgba(122,0,22,0.15); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary-maroon); font-weight: 700; display: block;">Estimated Fee</span>
              <strong id="calc-price-display" style="font-size: 1.8rem; font-family: var(--font-heading); color: var(--primary-maroon);">UGX 15,600</strong>
            </div>
            <button type="button" class="btn btn-maroon btn-sm" id="btn-prebook-shortcut">Pre-Book Parcel Now</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Active Schedules Grid -->
    <div class="card" style="margin-top: 1.5rem;">
      <div class="card-title-bar">
        <h3 style="color: var(--primary-blue)">📅 Scheduled Departures (Today)</h3>
        <span class="badge badge-success">Active departures</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Journey Code</th>
              <th>Route</th>
              <th>Bus Reg No</th>
              <th>Scheduled Time</th>
              <th>Status</th>
              <th>Booking Status</th>
            </tr>
          </thead>
          <tbody>
            ${a.journeys.map(v=>{const $=a.buses.find(s=>s.id===v.busId),I=Object.keys(v.tickets).length,C=$?$.capacity-I:0;let t="";return v.status==="In Transit"?t='<span class="badge badge-maroon">In Transit</span>':v.status==="Scheduled"?t='<span class="badge badge-blue">Scheduled</span>':v.status==="Completed"?t='<span class="badge badge-success">Completed</span>':t='<span class="badge badge-danger">Cancelled</span>',`
                <tr>
                  <td><strong>${v.id.toUpperCase()}</strong></td>
                  <td>${v.routeFrom} ➔ ${v.routeTo}</td>
                  <td><code style="font-weight: 700; font-size: 0.95rem; color: var(--primary-blue);">${$?$.regNo:"N/A"}</code></td>
                  <td>${new Date(v.departureTime).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1})}</td>
                  <td>${t}</td>
                  <td>
                    ${v.status==="Scheduled"?`<span style="font-weight: 600; color: var(--success);">${C} Seats Available</span>`:'<span style="color: var(--text-light); font-size: 0.85rem;">Booking closed</span>'}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,document.getElementById("calc-form");const l=document.getElementById("calc-route"),e=document.getElementById("calc-weight"),d=document.getElementById("calc-size"),p=document.getElementById("calc-fragile"),c=document.getElementById("calc-price-display"),g=()=>{const v=l.value,$=parseFloat(e.value)||0,I=d.value,C=p.checked,t=a.destinations.find(u=>u.id===v);if(!t)return;const s=Q($,t.courierBase,t.courierPerKg,C,I);c.textContent=E(s)};l.addEventListener("change",g),e.addEventListener("input",g),d.addEventListener("change",g),p.addEventListener("change",g),g(),document.getElementById("btn-prebook-shortcut").addEventListener("click",()=>{const v=l.value,$=e.value,I=d.value,C=p.checked;r("courier-client",{prefill:{routeId:v,weight:$,size:I,isFragile:C}})})}function ve(b,a,r,l={}){const e=l.prefill||{};b.innerHTML=`
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-maroon);">📦 Courier Customer Portal</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Track packages in real-time or register new courier shipments</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Navigation Tabs -->
    <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 2px solid var(--accent-gray-medium); padding-bottom: 1px;">
      <button class="btn btn-sm active-tab-btn btn-maroon" id="tab-track-btn" style="border-radius: 6px 6px 0 0; margin-bottom: -2px;">🔍 Track Parcel</button>
      <button class="btn btn-sm btn-secondary" id="tab-book-btn" style="border-radius: 6px 6px 0 0; border-bottom: none; margin-bottom: -2px; background: transparent;">📋 Online Pre-Booking</button>
    </div>

    <!-- Tab 1: Track Package -->
    <div id="tab-track-content">
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-title-bar">
          <h3>Search Package Shipment</h3>
          <span style="color: var(--text-light); font-size: 0.8rem;">Enter 6-digit tracking code</span>
        </div>
        <div class="search-bar-row">
          <div class="search-input-wrapper">
            <input type="text" id="track-id-input" placeholder="e.g. YY-PRC-881920" style="padding-left: 14px;" value="${l.trackId||""}">
          </div>
          <button class="btn btn-maroon" id="btn-track-submit">Track Status</button>
        </div>
        
        <!-- Suggestions helper -->
        <div style="font-size: 0.85rem; color: var(--text-medium);">
          <span>Demo Tracking Codes to try: </span>
          ${a.parcels.slice(0,3).map(s=>`
            <a href="#" class="demo-track-link" style="color: var(--primary-maroon); margin-right: 12px; font-family: monospace; font-weight: 700;">${s.id}</a>
          `).join("")}
        </div>
      </div>

      <!-- Tracking Results Workspace -->
      <div id="tracking-results-card" style="display: none;">
        <!-- Inject tracker results dynamically -->
      </div>
    </div>

    <!-- Tab 2: Pre-Booking Pannel -->
    <div id="tab-book-content" style="display: none;">
      <div class="grid-2">
        <!-- Input Form -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Pre-Book Delivery Pouch</h3>
            <span class="badge badge-maroon">Quick Check-in</span>
          </div>
          <form id="prebook-form">
            <div class="form-row">
              <div class="form-group">
                <label for="pb-sender">Sender Name</label>
                <input type="text" id="pb-sender" placeholder="e.g. Opio Samuel" required>
              </div>
              <div class="form-group">
                <label for="pb-sender-phone">Sender Phone Number</label>
                <input type="text" id="pb-sender-phone" placeholder="e.g. +256 772 123456" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pb-receiver">Receiver Name</label>
                <input type="text" id="pb-receiver" placeholder="e.g. Akello Sarah" required>
              </div>
              <div class="form-group">
                <label for="pb-receiver-phone">Receiver Phone Number</label>
                <input type="text" id="pb-receiver-phone" placeholder="e.g. +256 701 987654" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pb-route">Destination (From Kampala)</label>
                <select id="pb-route" required>
                  ${a.destinations.map(s=>`<option value="${s.id}" ${s.id===e.routeId?"selected":""}>${s.name}</option>`).join("")}
                </select>
              </div>
              <div class="form-group">
                <label for="pb-size">Approx. Size</label>
                <select id="pb-size">
                  <option value="small" ${e.size==="small"?"selected":""}>Small (Envelope)</option>
                  <option value="medium" ${e.size==="medium"||!e.size?"selected":""}>Medium (Box/Bag)</option>
                  <option value="large" ${e.size==="large"?"selected":""}>Large (Suitcase)</option>
                  <option value="extra-large" ${e.size==="extra-large"?"selected":""}>Extra Large (Huge sack)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pb-weight">Estimated Weight (kg)</label>
                <input type="number" id="pb-weight" min="0.1" step="0.1" value="${e.weight||"2.0"}" required>
              </div>
              <div class="form-group">
                <label for="pb-desc">Item Description</label>
                <input type="text" id="pb-desc" placeholder="e.g. Documents, Electronics, Shoes" required>
              </div>
            </div>

            <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="pb-fragile" style="width: auto; margin-right: 6px;" ${e.isFragile?"checked":""}>
              <label for="pb-fragile" style="margin-bottom: 0;">Contains Fragile / Electronic Items</label>
            </div>

            <button type="submit" class="btn btn-maroon btn-block" style="margin-top: 1rem;">
              💾 Generate Pre-Booking Voucher
            </button>
          </form>
        </div>

        <!-- Cost Breakdown / Receipt preview -->
        <div class="card" id="prebook-voucher-card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 350px;">
          <div style="text-align: center; color: var(--text-light);">
            <span style="font-size: 3.5rem;">🎫</span>
            <h4 style="margin-top: 10px; color: var(--text-medium);">Pre-Booking Voucher</h4>
            <p style="font-size: 0.85rem; max-width: 320px; margin: 6px auto;">
              Complete the form on the left to generate your booking barcode. Show it to any YY Courier Handler at the gate to check-in your luggage quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;const d=document.getElementById("tab-track-btn"),p=document.getElementById("tab-book-btn"),c=document.getElementById("tab-track-content"),g=document.getElementById("tab-book-content");d.addEventListener("click",()=>{d.className="btn btn-sm btn-maroon",p.className="btn btn-sm btn-secondary",p.style.background="transparent",p.style.borderBottom="none",c.style.display="block",g.style.display="none"}),p.addEventListener("click",()=>{p.className="btn btn-sm btn-maroon",d.className="btn btn-sm btn-secondary",d.style.background="transparent",d.style.borderBottom="none",g.style.display="block",c.style.display="none"}),l.prefill&&p.click(),document.getElementById("btn-back-portal").addEventListener("click",()=>r("portal"));const v=document.getElementById("track-id-input"),$=document.getElementById("tracking-results-card"),I=s=>{if(s=s.trim().toUpperCase(),!s)return;const u=a.parcels.find(f=>f.id===s||f.id.replace(/-/g,"").includes(s.replace(/-/g,"")));if(!u){$.style.display="block",$.innerHTML=`
        <div class="card" style="border: 2px dashed var(--danger); text-align: center; padding: 2rem;">
          <span style="font-size: 2.5rem; color: var(--danger);">⚠️</span>
          <h3 style="color: var(--danger); margin-top: 8px;">Shipment Not Found</h3>
          <p style="color: var(--text-medium); font-size: 0.9rem; max-width: 400px; margin: 8px auto;">
            We couldn't find a package registered under "<strong>${s}</strong>". Please double check your tracking code or verify with the dispatch handler.
          </p>
        </div>
      `;return}const y=["Intake","Dispatched","Arrived","Collected"],h=y.indexOf(u.status),S=y.map((f,o)=>{let m="accent-gray-medium",k="⚪",L="color: var(--text-light);";return o<h?(m="success",k="✅",L="color: var(--success); font-weight: 600;"):o===h&&(m="maroon",k="📦",L="color: var(--primary-maroon); font-weight: 700; scale: 1.1;"),`
        <div class="history-node ${m}" style="flex: 1; text-align: center;">
          <div style="font-size: 1.5rem; margin-bottom: 4px;">${k}</div>
          <div class="history-node-title" style="${L}">${f}</div>
          <div class="history-node-time" style="font-size: 0.75rem;">
            ${u.history.find(D=>D.status===f)?K(u.history.find(D=>D.status===f).time):""}
          </div>
        </div>
      `}).join("");$.style.display="block",$.innerHTML=`
      <div class="card" style="border-top: 6px solid var(--primary-maroon); margin-bottom: 2rem;">
        <div class="card-title-bar">
          <div>
            <h3 style="color: var(--primary-maroon)">Tracking Reference: ${u.id}</h3>
            <span style="font-size: 0.8rem; color: var(--text-light)">Booked on ${K(u.createdDate)}</span>
          </div>
          <span class="badge ${u.status==="Collected"?"badge-success":u.status==="Arrived"?"badge-info":u.status==="Dispatched"?"badge-maroon":"badge-warning"}" style="font-size: 0.9rem; padding: 6px 14px;">
            ${u.status}
          </span>
        </div>

        <!-- Progress Timeline -->
        <div style="display: flex; justify-content: space-between; position: relative; margin: 2rem 0; background: var(--accent-gray-light); padding: 1.5rem; border-radius: var(--border-radius-md);">
          <!-- Connecting Line -->
          <div style="position: absolute; top: calc(50% - 10px); left: 10%; right: 10%; height: 3px; background: var(--accent-gray-medium); z-index: 1;"></div>
          <!-- Colored Progress Indicator Line -->
          <div style="position: absolute; top: calc(50% - 10px); left: 10%; width: ${Math.max(0,h)*26.6}%; height: 3px; background: var(--primary-maroon); z-index: 2; transition: var(--transition);"></div>
          
          <div style="display: flex; width: 100%; justify-content: space-between; z-index: 3;">
            ${S}
          </div>
        </div>

        <div class="grid-2" style="margin-top: 1.5rem;">
          <!-- Parcel Specs -->
          <div>
            <h4 style="margin-bottom: 12px; color: var(--primary-blue); font-size: 1rem; border-bottom: 1px solid var(--accent-gray-medium); padding-bottom: 6px;">📋 Shipment Details</h4>
            <div class="receipt-row"><span>Route Corridor:</span><strong>Kampala ➔ ${u.routeTo}</strong></div>
            <div class="receipt-row"><span>Sender:</span><span>${u.senderName} (${u.senderPhone})</span></div>
            <div class="receipt-row"><span>Receiver:</span><strong>${u.receiverName} (${u.receiverPhone})</strong></div>
            <div class="receipt-row"><span>Item Info:</span><span>${u.description}</span></div>
            <div class="receipt-row"><span>Package Size:</span><span>Weight: ${u.weightKg} kg (${u.dimensions})</span></div>
            <div class="receipt-row"><span>Courier Fee Paid:</span><strong style="color: var(--primary-maroon);">${E(u.priceUGX)}</strong></div>
            ${u.journeyId?`
              <div style="margin-top: 10px; padding: 8px; background: var(--primary-blue-light); border-radius: 6px; border: 1px solid var(--primary-blue-light); font-size: 0.8rem; display: flex; align-items: center; gap: 8px;">
                <span>🚌</span>
                <span>Assigned to active Bus journey <strong>${u.journeyId.toUpperCase()}</strong>.</span>
              </div>
            `:""}
          </div>

          <!-- Package Logs -->
          <div>
            <h4 style="margin-bottom: 12px; color: var(--primary-blue); font-size: 1rem; border-bottom: 1px solid var(--accent-gray-medium); padding-bottom: 6px;">📜 History Logs</h4>
            <div class="history-timeline">
              ${u.history.map(f=>`
                <div class="history-node success">
                  <div class="history-node-title">${f.description}</div>
                  <div class="history-node-time">${K(f.time)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `};document.getElementById("btn-track-submit").addEventListener("click",()=>{I(v.value)}),v.addEventListener("keypress",s=>{s.key==="Enter"&&I(v.value)}),document.querySelectorAll(".demo-track-link").forEach(s=>{s.addEventListener("click",u=>{u.preventDefault();const y=u.target.textContent;v.value=y,I(y)})}),l.trackId&&I(l.trackId);const C=document.getElementById("prebook-form"),t=document.getElementById("prebook-voucher-card");C.addEventListener("submit",s=>{s.preventDefault();const u=document.getElementById("pb-sender").value,y=document.getElementById("pb-sender-phone").value,h=document.getElementById("pb-receiver").value,S=document.getElementById("pb-receiver-phone").value,f=document.getElementById("pb-route").value,o=document.getElementById("pb-size").value,m=parseFloat(document.getElementById("pb-weight").value)||1,k=document.getElementById("pb-desc").value,L=document.getElementById("pb-fragile").checked,D=a.destinations.find(x=>x.id===f);if(!D)return;const z=Q(m,D.courierBase,D.courierPerKg,L,o),i=_("YY-DFT",6),n={id:i,senderName:u,senderPhone:y,receiverName:h,receiverPhone:S,routeFrom:"Kampala",routeTo:D.name,weightKg:m,dimensions:`${o} box / package`,description:k,priceUGX:z,status:"Draft",journeyId:null,history:[{status:"Draft",time:new Date().toISOString(),description:"Pre-booked online by sender. Awaiting counter check-in."}],createdDate:new Date().toISOString()};r("update-state",x=>(x.parcels.unshift(n),x)),t.innerHTML=`
      <div class="simulated-receipt" style="width: 100%; border-color: var(--primary-maroon); border-style: solid;">
        <div class="receipt-header">
          <div class="receipt-title">YY BUSES COURIER</div>
          <div style="font-size: 0.75rem; text-transform: uppercase;">Uganda Parcel Service</div>
          <strong style="color: var(--primary-maroon); font-size: 0.85rem; display: block; margin-top: 4px;">PRE-BOOKING VOUCHER</strong>
        </div>
        
        <div class="receipt-row"><span>Voucher ID:</span><strong style="font-family: monospace; font-size: 1.1rem;">${i}</strong></div>
        <div class="receipt-row"><span>Date:</span><span>${K(new Date)}</span></div>
        <div class="receipt-divider"></div>
        
        <div class="receipt-row"><span>From:</span><span>Kampala Terminal</span></div>
        <div class="receipt-row"><span>To:</span><strong>${D.name} Hub</strong></div>
        <div class="receipt-row"><span>Sender:</span><span>${u}</span></div>
        <div class="receipt-row"><span>Receiver:</span><strong>${h} (${S})</strong></div>
        <div class="receipt-row"><span>Content:</span><span>${k} (${m} kg)</span></div>
        
        <div class="receipt-divider"></div>
        <div class="receipt-row" style="font-size: 1.1rem;"><span>Estimated Cost:</span><strong style="color: var(--primary-maroon);">${E(z)}</strong></div>
        
        <div class="receipt-barcode">
          <!-- Inline Mock Barcode using SVG -->
          <div style="margin-top: 10px;">
            <svg width="200" height="60" viewBox="0 0 200 60">
              <rect width="100%" height="100%" fill="white" />
              <!-- Generate simulated stripes -->
              ${Array.from({length:30}).map((x,B)=>{const w=B%3===0?4:B%2===0?2:1;return`<rect x="${B*6+10}" y="5" width="${w}" height="40" fill="black" />`}).join("")}
              <text x="100" y="55" text-anchor="middle" font-size="9" font-family="monospace">${i}</text>
            </svg>
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 8px; width: 100%; margin-top: 1rem;">
        <button class="btn btn-secondary btn-block btn-sm" id="btn-print-voucher">🖨️ Print Voucher</button>
        <button class="btn btn-maroon btn-block btn-sm" id="btn-reset-voucher">📋 Book Another</button>
      </div>
    `,document.getElementById("btn-print-voucher").addEventListener("click",()=>{const x=document.createElement("div");x.className="print-only-container",x.innerHTML=document.querySelector(".simulated-receipt").innerHTML,document.body.appendChild(x),window.print(),document.body.removeChild(x)}),document.getElementById("btn-reset-voucher").addEventListener("click",()=>{C.reset(),r("courier-client",{prefill:{}})})})}function be(b,a,r){const l=a.journeys.filter(i=>i.status==="Scheduled"||i.status==="In Transit"),e=a.parcels.filter(i=>i.status==="Intake"),d=a.parcels.filter(i=>i.status==="Dispatched"),p=a.parcels.filter(i=>i.status==="Arrived"),c=a.parcels.filter(i=>i.status==="Draft");b.innerHTML=`
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-maroon);">📦 Courier Handler Terminal</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Receive client packages, route to departing buses, and coordinate regional collections</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Stats summary Row -->
    <div class="stats-grid" style="margin-bottom: 1.5rem;">
      <div class="stat-card">
        <div class="stat-icon maroon">📥</div>
        <div class="stat-info">
          <span class="stat-label">Warehouse Inventory</span>
          <span class="stat-value">${e.length}</span>
          <span class="stat-trend" style="color: var(--text-light)">Awaiting dispatch</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">🚌</div>
        <div class="stat-info">
          <span class="stat-label">Parcels En Route</span>
          <span class="stat-value">${d.length}</span>
          <span class="stat-trend trend-up">▲ In Transit</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">📦</div>
        <div class="stat-info">
          <span class="stat-label">Awaiting Collection</span>
          <span class="stat-value">${p.length}</span>
          <span class="stat-trend" style="color: var(--success)">Ready for pickup</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">📝</div>
        <div class="stat-info">
          <span class="stat-label">Online Drafts</span>
          <span class="stat-value">${c.length}</span>
          <span class="stat-trend" style="color: var(--primary-maroon)">Pre-bookings</span>
        </div>
      </div>
    </div>

    <!-- Navigation Sub-Tabs -->
    <div style="display: flex; gap: 8px; margin-bottom: 1.5rem; border-bottom: 2px solid var(--accent-gray-medium); padding-bottom: 1px;">
      <button class="btn btn-sm btn-maroon" id="subtab-intake-btn" style="border-radius: 6px 6px 0 0; margin-bottom: -2px;">📥 Package In-Take</button>
      <button class="btn btn-sm btn-secondary" id="subtab-dispatch-btn" style="border-radius: 6px 6px 0 0; border-bottom: none; margin-bottom: -2px; background: transparent; color: var(--text-medium);">🚌 Dispatch to Bus</button>
      <button class="btn btn-sm btn-secondary" id="subtab-pickup-btn" style="border-radius: 6px 6px 0 0; border-bottom: none; margin-bottom: -2px; background: transparent; color: var(--text-medium);">🎁 Arrivals & Collections</button>
    </div>

    <!-- Section 1: Package In-Take -->
    <div id="subtab-intake-content">
      <div class="grid-2">
        <!-- New intake form -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Package Registration</h3>
            <span style="color: var(--text-light); font-size: 0.8rem;">Register cargo packages</span>
          </div>

          <!-- Draft Lookup Bar -->
          <div style="background: var(--accent-gray-light); padding: 10px; border-radius: var(--border-radius-md); margin-bottom: 1.25rem; display: flex; gap: 10px; align-items: center;">
            <span style="font-size: 1.1rem;">🔍</span>
            <input type="text" id="draft-lookup-id" placeholder="Look up Pre-booking Code (e.g. YY-DFT-...)" style="padding: 6px 10px; font-size: 0.85rem;">
            <button class="btn btn-maroon btn-sm" id="btn-lookup-draft">Fetch</button>
          </div>

          <form id="intake-form">
            <input type="hidden" id="intake-draft-id" value="">
            <div class="form-row">
              <div class="form-group">
                <label for="int-sender">Sender Name</label>
                <input type="text" id="int-sender" required>
              </div>
              <div class="form-group">
                <label for="int-sender-phone">Sender Phone</label>
                <input type="text" id="int-sender-phone" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="int-receiver">Receiver Name</label>
                <input type="text" id="int-receiver" required>
              </div>
              <div class="form-group">
                <label for="int-receiver-phone">Receiver Phone</label>
                <input type="text" id="int-receiver-phone" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="int-route">Destination Station</label>
                <select id="int-route" required>
                  ${a.destinations.map(i=>`<option value="${i.id}">${i.name}</option>`).join("")}
                </select>
              </div>
              <div class="form-group">
                <label for="int-size">Package Size</label>
                <select id="int-size">
                  <option value="small">Small (Envelope)</option>
                  <option value="medium" selected>Medium (Box/Bag)</option>
                  <option value="large">Large (Suitcase)</option>
                  <option value="extra-large">Extra Large (Undercarriage sack)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="int-weight">Measured Weight (kg)</label>
                <input type="number" id="int-weight" min="0.1" step="0.1" value="2.0" required>
              </div>
              <div class="form-group">
                <label for="int-desc">Contents Description</label>
                <input type="text" id="int-desc" required>
              </div>
            </div>

            <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="int-fragile" style="width: auto; margin-right: 6px;">
              <label for="int-fragile" style="margin-bottom: 0;">Fragile / Special handling requested</label>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 1rem;">
              <button type="submit" class="btn btn-maroon btn-block">📥 Complete Intake & Generate Tag</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-intake">Clear</button>
            </div>
          </form>
        </div>

        <!-- Print slip review area -->
        <div class="card" id="intake-print-preview" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 400px; border: 2px dashed var(--accent-gray-medium);">
          <div style="text-align: center; color: var(--text-light);">
            <span style="font-size: 4rem;">🏷️</span>
            <h4 style="margin-top: 10px; color: var(--text-medium);">Intake Print Preview</h4>
            <p style="font-size: 0.85rem; max-width: 320px; margin: 6px auto;">
              Complete the intake registration form or look up a customer pre-booking to generate a barcoded parcel sticker tag and receipt.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Dispatch to Bus -->
    <div id="subtab-dispatch-content" style="display: none;">
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-title-bar">
          <h3>Load Parcels onto YY Bus Journeys</h3>
          <span class="badge badge-maroon">${e.length} Items Pending Dispatch</span>
        </div>
        
        ${e.length===0?`
          <div style="text-align: center; padding: 3rem 1rem; color: var(--text-light);">
            <span style="font-size: 2.5rem;">📦</span>
            <p style="margin-top: 10px; font-weight: 500;">No packages currently sitting in the warehouse. All set!</p>
          </div>
        `:`
          <div class="grid-3" style="align-items: stretch; margin-bottom: 1.5rem;">
            <!-- Select Bus Journey Dropdown -->
            <div class="card" style="box-shadow: none; border-color: var(--accent-gray-medium); display: flex; flex-direction: column; justify-content: space-between; padding: 1rem;">
              <div>
                <label for="dispatch-journey-id" style="font-weight: 700;">1. Select Bus Route Journey</label>
                <select id="dispatch-journey-id" style="margin-top: 6px;" required>
                  <option value="">-- Choose Departing Bus Journey --</option>
                  ${l.map(i=>{const n=a.buses.find(x=>x.id===i.busId);return`<option value="${i.id}">[${i.id.toUpperCase()}] ${i.routeFrom} ➔ ${i.routeTo} (${n?n.regNo:"No Bus"})</option>`}).join("")}
                </select>
                <p style="font-size: 0.75rem; color: var(--text-medium); margin-top: 8px;">
                  Only scheduled or active in-transit journeys are listed here.
                </p>
              </div>
              <button class="btn btn-blue btn-block" id="btn-execute-dispatch" style="margin-top: 1rem;" disabled>
                🚚 Dispatch Selected Parcels
              </button>
            </div>

            <!-- Hint instructions -->
            <div style="grid-column: span 2; display: flex; flex-direction: column; justify-content: center; padding: 0 1rem;">
              <h4 style="color: var(--primary-blue);">Routing Guidance</h4>
              <p style="font-size: 0.85rem; color: var(--text-medium); margin-top: 4px;">
                Select the parcels on the table below that are bound for stations along the chosen bus journey corridor, and click "Dispatch Selected Parcels". The system will update client tracking and add these items to the bus's cargo manifests automatically.
              </p>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 40px;"><input type="checkbox" id="select-all-dispatch" style="width: auto; cursor: pointer;"></th>
                  <th>Parcel ID</th>
                  <th>Destination</th>
                  <th>Description</th>
                  <th>Receiver Details</th>
                  <th>Size / Weight</th>
                  <th>Logged Date</th>
                </tr>
              </thead>
              <tbody>
                ${e.map(i=>`
                  <tr>
                    <td><input type="checkbox" class="dispatch-parcel-check" value="${i.id}" style="width: auto; cursor: pointer;"></td>
                    <td><strong>${i.id}</strong></td>
                    <td><span class="badge badge-maroon">${i.routeTo}</span></td>
                    <td>${i.description}</td>
                    <td>${i.receiverName} (${i.receiverPhone})</td>
                    <td>${i.weightKg} kg (${i.dimensions})</td>
                    <td style="font-size: 0.8rem; color: var(--text-light);">${K(i.createdDate)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>

    <!-- Section 3: Arrivals & Pickups -->
    <div id="subtab-pickup-content" style="display: none;">
      <div class="grid-2">
        <!-- Arrivals Manager -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Coordinate Terminal Arrivals</h3>
            <span class="badge badge-blue">${d.length} En Route</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-medium); margin-bottom: 1rem;">
            When a bus arrives at your station, search the bus journey and mark all parcels on it as "Arrived" so customers are notified for collection.
          </p>

          ${d.length===0?`
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
              <p>No parcels currently en-route on buses.</p>
            </div>
          `:`
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Parcel ID</th>
                    <th>Bus Journey</th>
                    <th>Destination</th>
                    <th>Receiver</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.map(i=>`
                    <tr>
                      <td><strong>${i.id}</strong></td>
                      <td><span class="badge badge-blue">${i.journeyId?i.journeyId.toUpperCase():"N/A"}</span></td>
                      <td>${i.routeTo}</td>
                      <td>${i.receiverName}</td>
                      <td>
                        <button class="btn btn-sm btn-success btn-arrive-parcel" data-id="${i.id}">📥 Arrived</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Collection / Pickup Registrar -->
        <div class="card">
          <div class="card-title-bar">
            <h3>Receiver Collection Registry</h3>
            <span class="badge badge-success">${p.length} Ready</span>
          </div>

          <!-- Pickup Search Bar -->
          <div class="search-bar-row">
            <div class="search-input-wrapper">
              <input type="text" id="pickup-search-input" placeholder="Search Parcel ID or Receiver Name..." style="padding-left: 14px;">
            </div>
          </div>

          <div class="table-wrapper" style="max-height: 300px;">
            <table>
              <thead>
                <tr>
                  <th>Parcel ID</th>
                  <th>Receiver</th>
                  <th>Destination</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="pickup-list-tbody">
                ${p.map(i=>`
                  <tr class="pickup-table-row" data-search="${i.id.toLowerCase()} ${i.receiverName.toLowerCase()}">
                    <td><strong>${i.id}</strong></td>
                    <td>
                      <div><strong>${i.receiverName}</strong></div>
                      <div style="font-size: 0.75rem; color: var(--text-light);">${i.receiverPhone}</div>
                    </td>
                    <td>${i.routeTo}</td>
                    <td>
                      <button class="btn btn-sm btn-maroon btn-collect-parcel" data-id="${i.id}">📦 Handout</button>
                    </td>
                  </tr>
                `).join("")}
                ${p.length===0?`
                  <tr><td colspan="4" style="text-align: center; color: var(--text-light);">No parcels currently awaiting collection.</td></tr>
                `:""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;const g=document.getElementById("subtab-intake-btn"),v=document.getElementById("subtab-dispatch-btn"),$=document.getElementById("subtab-pickup-btn"),I=document.getElementById("subtab-intake-content"),C=document.getElementById("subtab-dispatch-content"),t=document.getElementById("subtab-pickup-content");g.addEventListener("click",()=>{g.className="btn btn-sm btn-maroon",v.className="btn btn-sm btn-secondary",v.style.background="transparent",$.className="btn btn-sm btn-secondary",$.style.background="transparent",I.style.display="block",C.style.display="none",t.style.display="none"}),v.addEventListener("click",()=>{v.className="btn btn-sm btn-maroon",g.className="btn btn-sm btn-secondary",g.style.background="transparent",$.className="btn btn-sm btn-secondary",$.style.background="transparent",C.style.display="block",I.style.display="none",t.style.display="none"}),$.addEventListener("click",()=>{$.className="btn btn-sm btn-maroon",g.className="btn btn-sm btn-secondary",g.style.background="transparent",v.className="btn btn-sm btn-secondary",v.style.background="transparent",t.style.display="block",I.style.display="none",C.style.display="none"}),document.getElementById("btn-back-portal").addEventListener("click",()=>r("portal"));const s=document.getElementById("intake-form"),u=document.getElementById("draft-lookup-id"),y=document.getElementById("btn-lookup-draft"),h=document.getElementById("intake-draft-id");y.addEventListener("click",()=>{var B;const i=u.value.trim().toUpperCase();if(!i)return;const n=a.parcels.find(w=>w.id===i&&w.status==="Draft");if(!n){alert("Draft booking code not found or already verified.");return}document.getElementById("int-sender").value=n.senderName,document.getElementById("int-sender-phone").value=n.senderPhone,document.getElementById("int-receiver").value=n.receiverName,document.getElementById("int-receiver-phone").value=n.receiverPhone,document.getElementById("int-desc").value=n.description,document.getElementById("int-weight").value=n.weightKg,document.getElementById("int-fragile").checked=((B=n.history[0])==null?void 0:B.description.includes("Fragile"))||!1;const x=a.destinations.find(w=>w.name===n.routeTo);x&&(document.getElementById("int-route").value=x.id),h.value=n.id,alert(`Fetched draft pre-booking details for ${n.senderName}!`)}),s.addEventListener("submit",i=>{i.preventDefault();const n=document.getElementById("int-sender").value,x=document.getElementById("int-sender-phone").value,B=document.getElementById("int-receiver").value,w=document.getElementById("int-receiver-phone").value,P=document.getElementById("int-route").value,A=document.getElementById("int-size").value,T=parseFloat(document.getElementById("int-weight").value)||1,O=document.getElementById("int-desc").value,U=document.getElementById("int-fragile").checked,J=h.value,j=a.destinations.find(N=>N.id===P);if(!j)return;const F=Q(T,j.courierBase,j.courierPerKg,U,A),Y=_("YY-PRC",6);r("update-state",N=>{J&&(N.parcels=N.parcels.filter(se=>se.id!==J));const ae={id:Y,senderName:n,senderPhone:x,receiverName:B,receiverPhone:w,routeFrom:"Kampala",routeTo:j.name,weightKg:T,dimensions:`${A.toUpperCase()} package`,description:O,priceUGX:F,status:"Intake",journeyId:null,history:[{status:"Intake",time:new Date().toISOString(),description:"Verified & checked-in at Kampala terminal. Logged by Handler."}],createdDate:new Date().toISOString()};return N.parcels.unshift(ae),N});const H=document.getElementById("intake-print-preview");H.className="card",H.style.border="1px solid var(--primary-maroon)";const q=me(Y);H.innerHTML=`
      <div class="simulated-receipt" id="label-receipt" style="width: 100%; border: 3px solid var(--primary-blue); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary-blue); padding-bottom: 6px;">
          <div>
            <strong style="font-size: 1.1rem; color: var(--primary-maroon);">YY COURIER</strong>
            <span style="font-size: 0.65rem; display: block; letter-spacing: 1px; color: var(--text-medium)">UGANDA PARCEL SERVICE</span>
          </div>
          <div style="text-align: right;">
            <strong style="font-size: 1.25rem; font-family: monospace; color: var(--primary-blue);">${Y}</strong>
          </div>
        </div>

        <div style="margin: 10px 0; font-size: 0.8rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Sender</span>
              <div style="font-weight: 700;">${n}</div>
              <div>${x}</div>
            </div>
            <div>
              <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Receiver (Call on arrival)</span>
              <div style="font-weight: 700; color: var(--primary-maroon);">${B}</div>
              <div style="font-weight: 700;">${w}</div>
            </div>
          </div>
        </div>

        <div style="border-top: 1px dashed var(--accent-gray-medium); border-bottom: 1px dashed var(--accent-gray-medium); padding: 6px 0; margin: 10px 0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Destination Station</span>
            <div style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-heading); color: var(--primary-blue);">${j.name.toUpperCase()}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.6rem; color: var(--text-light); text-transform: uppercase;">Weight / Charge</span>
            <div style="font-weight: 700; font-size: 1.05rem;">${T} kg</div>
            <div style="font-weight: 700; color: var(--primary-maroon);">${E(F)}</div>
          </div>
        </div>

        <div style="font-size: 0.75rem; background: var(--accent-gray-light); padding: 4px; border-radius: 4px;">
          <strong>Contents:</strong> ${O} ${U?'⚠️ <strong style="color: var(--danger)">FRAGILE</strong>':""}
        </div>

        <div style="display: flex; justify-content: center; align-items: center; margin-top: 12px; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px;">
          ${q}
        </div>
      </div>

      <div style="display: flex; gap: 8px; width: 100%; margin-top: 1rem;">
        <button class="btn btn-blue btn-block btn-sm" id="btn-print-label">🖨️ Print Shipping Label</button>
        <button class="btn btn-secondary btn-block btn-sm" id="btn-reset-intake">🔄 Reset Form</button>
      </div>
    `,s.reset(),h.value="",document.getElementById("btn-print-label").addEventListener("click",()=>{const N=document.createElement("div");N.className="print-only-container",N.innerHTML=document.getElementById("label-receipt").innerHTML,document.body.appendChild(N),window.print(),document.body.removeChild(N)}),document.getElementById("btn-reset-intake").addEventListener("click",()=>{r("courier-handler")})}),document.getElementById("btn-clear-intake").addEventListener("click",()=>{s.reset(),h.value=""});const S=document.getElementById("select-all-dispatch"),f=document.querySelectorAll(".dispatch-parcel-check"),o=document.getElementById("dispatch-journey-id"),m=document.getElementById("btn-execute-dispatch");S&&(S.addEventListener("change",i=>{const n=i.target.checked;f.forEach(x=>{x.checked=n}),k()}),f.forEach(i=>{i.addEventListener("change",k)}),o.addEventListener("change",k));function k(){const i=document.querySelectorAll(".dispatch-parcel-check:checked").length,n=o.value!=="";m.disabled=!(i>0&&n)}m&&m.addEventListener("click",()=>{const i=o.value,n=Array.from(document.querySelectorAll(".dispatch-parcel-check:checked")).map(w=>w.value),x=a.journeys.find(w=>w.id===i),B=a.buses.find(w=>w.id===(x?x.busId:""));x&&(r("update-state",w=>(n.forEach(P=>{const A=w.parcels.find(T=>T.id===P);if(A){A.status="Dispatched",A.journeyId=i,A.history.push({status:"Dispatched",time:new Date().toISOString(),description:`Dispatched on Bus ${B?B.regNo:"N/A"} (Journey ${i.toUpperCase()}) departing for ${x.routeTo}`});const T=w.journeys.find(O=>O.id===i);T&&T.cargo.push({id:`crg-pkg-${P}`,description:`Courier Parcel: ${A.description} (Ref: ${P})`,weightKg:A.weightKg,chargeUGX:0,status:"Loaded"})}}),w)),alert(`Successfully loaded ${n.length} parcels onto Bus journey ${i.toUpperCase()}!`),r("courier-handler"))}),document.querySelectorAll(".btn-arrive-parcel").forEach(i=>{i.addEventListener("click",n=>{const x=n.target.getAttribute("data-id");r("update-state",B=>{const w=B.parcels.find(P=>P.id===x);return w&&(w.status="Arrived",w.history.push({status:"Arrived",time:new Date().toISOString(),description:`Arrived at regional office hub in ${w.routeTo}. Receiver notified for collection.`})),B}),alert(`Parcel ${x} checked into station. Ready for customer pickup!`),r("courier-handler")})}),document.querySelectorAll(".btn-collect-parcel").forEach(i=>{i.addEventListener("click",n=>{const x=n.target.getAttribute("data-id"),B=prompt("Please enter Receiver's verification ID number / document name for validation:");B!==null&&(r("update-state",w=>{const P=w.parcels.find(A=>A.id===x);return P&&(P.status="Collected",P.history.push({status:"Collected",time:new Date().toISOString(),description:`Collected by recipient. Verification info: [${B||"Mobile Code Verified"}].`})),w}),alert(`Parcel ${x} handed out successfully! Shipment archive closed.`),r("courier-handler"))})});const z=document.getElementById("pickup-search-input");z&&z.addEventListener("input",i=>{const n=i.target.value.toLowerCase();document.querySelectorAll(".pickup-table-row").forEach(B=>{B.getAttribute("data-search").includes(n)?B.style.display="table-row":B.style.display="none"})})}function he(b,a,r){const l=a.parcels.length,e=a.parcels.filter(t=>t.status==="Intake"||t.status==="Dispatched"||t.status==="Arrived").length,d=a.parcels.filter(t=>t.status==="Collected").length;a.parcels.filter(t=>t.status==="Draft").length;const p=a.parcels.filter(t=>t.status!=="Draft").reduce((t,s)=>t+s.priceUGX,0),c={};a.destinations.forEach(t=>{c[t.name]={count:0,revenue:0}}),a.parcels.forEach(t=>{t.status!=="Draft"&&c[t.routeTo]&&(c[t.routeTo].count++,c[t.routeTo].revenue+=t.priceUGX)}),b.innerHTML=`
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-maroon);">📊 Courier Admin Dashboard</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Overview parcel volumes, revenue growth, adjust route tariffs, and audit records</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Analytics Dashboard Cards -->
    <div class="stats-grid">
      <div class="stat-card" style="border-top: 4px solid var(--primary-maroon);">
        <div class="stat-icon maroon">💵</div>
        <div class="stat-info">
          <span class="stat-label">Gross Parcel Revenue</span>
          <span class="stat-value" style="color: var(--primary-maroon); font-size: 1.5rem;">${E(p)}</span>
          <span class="stat-trend trend-up">▲ Satisfied Clients</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--primary-blue);">
        <div class="stat-icon blue">📦</div>
        <div class="stat-info">
          <span class="stat-label">Total Shipments</span>
          <span class="stat-value">${l}</span>
          <span class="stat-trend trend-up">▲ In system ledger</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--info);">
        <div class="stat-icon info">⏳</div>
        <div class="stat-info">
          <span class="stat-label">Active Cargo</span>
          <span class="stat-value">${e}</span>
          <span class="stat-trend" style="color: var(--warning)">● In warehouse / Bus</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--success);">
        <div class="stat-icon success">🤝</div>
        <div class="stat-info">
          <span class="stat-label">Delivered & Collected</span>
          <span class="stat-value">${d}</span>
          <span class="stat-trend trend-up">▲ Archives closed</span>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Route Tariffs Modifier -->
      <div class="card">
        <div class="card-title-bar">
          <h3>📍 Route Pricing Adjustment</h3>
          <span class="badge badge-maroon">Manage Tariffs</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-medium); margin-bottom: 1rem;">
          YY Courier pricing rules operate on a baseline booking charge plus weight calculation per kg. Adjust tariffs below:
        </p>
        <div class="table-wrapper" style="max-height: 380px;">
          <table>
            <thead>
              <tr>
                <th>Route Destination</th>
                <th>Base Fare (UGX)</th>
                <th>Rate / Kg (UGX)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${a.destinations.map(t=>`
                <tr>
                  <td><strong>Kampala to ${t.name}</strong></td>
                  <td>
                    <input type="number" id="base-tariff-${t.id}" value="${t.courierBase}" step="500" style="padding: 6px; font-size: 0.85rem; width: 100px;">
                  </td>
                  <td>
                    <input type="number" id="kg-tariff-${t.id}" value="${t.courierPerKg}" step="100" style="padding: 6px; font-size: 0.85rem; width: 80px;">
                  </td>
                  <td>
                    <button class="btn btn-sm btn-blue btn-save-tariff" data-id="${t.id}">Save</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Volume Performance Chart -->
      <div class="card">
        <div class="card-title-bar">
          <h3>📈 Regional Route Performance</h3>
          <span class="badge badge-blue">Sales Volume</span>
        </div>
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 14px;">
          ${Object.entries(c).map(([t,s])=>{const u=p>0?s.revenue/p*100:0;return`
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">
                  <span>Kampala ➔ ${t}</span>
                  <span style="color: var(--primary-maroon);">${s.count} pkgs (${E(s.revenue)})</span>
                </div>
                <div style="height: 12px; background: var(--accent-gray-medium); border-radius: 6px; overflow: hidden;">
                  <div style="width: ${Math.max(3,u)}%; height: 100%; background: linear-gradient(90deg, var(--primary-blue), var(--primary-maroon)); border-radius: 6px;"></div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    </div>

    <!-- Complete Ledger Audit -->
    <div class="card" style="margin-top: 1.5rem;">
      <div class="card-title-bar">
        <h3>📜 Unified Courier Ledger & Auditing</h3>
        <span class="badge badge-secondary">${a.parcels.length} Transactions</span>
      </div>

      <!-- Filters Row -->
      <div style="display: flex; gap: 10px; margin-bottom: 1rem; flex-wrap: wrap;">
        <select id="filter-audit-status" style="max-width: 150px; font-size: 0.85rem; padding: 6px 10px;">
          <option value="ALL">All Statuses</option>
          <option value="Intake">Intake</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Arrived">Arrived</option>
          <option value="Collected">Collected</option>
          <option value="Draft">Draft Prebookings</option>
        </select>
        <select id="filter-audit-route" style="max-width: 180px; font-size: 0.85rem; padding: 6px 10px;">
          <option value="ALL">All Destinations</option>
          ${a.destinations.map(t=>`<option value="${t.name}">${t.name}</option>`).join("")}
        </select>
        <button class="btn btn-secondary btn-sm" id="btn-reset-audit-filters">Reset Filters</button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Destination</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Parcel details</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id="ledger-audit-tbody">
            ${a.parcels.map(t=>`
              <tr class="ledger-row" data-status="${t.status}" data-destination="${t.routeTo}">
                <td><strong style="font-family: monospace;">${t.id}</strong></td>
                <td>Kampala ➔ ${t.routeTo}</td>
                <td>${t.senderName}</td>
                <td>${t.receiverName}</td>
                <td><span style="font-size: 0.85rem; color: var(--text-medium);">${t.description} (${t.weightKg} kg)</span></td>
                <td style="font-weight: 600; color: var(--primary-maroon);">${E(t.priceUGX)}</td>
                <td>
                  <span class="badge ${t.status==="Collected"?"badge-success":t.status==="Arrived"?"badge-info":t.status==="Dispatched"?"badge-maroon":t.status==="Draft"?"badge-secondary":"badge-warning"}">
                    ${t.status}
                  </span>
                </td>
                <td style="font-size: 0.75rem; color: var(--text-light);">${K(t.createdDate)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,document.querySelectorAll(".btn-save-tariff").forEach(t=>{t.addEventListener("click",s=>{const u=s.target.getAttribute("data-id"),y=parseFloat(document.getElementById(`base-tariff-${u}`).value)||0,h=parseFloat(document.getElementById(`kg-tariff-${u}`).value)||0;r("update-state",S=>{const f=S.destinations.find(o=>o.id===u);return f&&(f.courierBase=y,f.courierPerKg=h),S}),alert("Pricing rules updated successfully for route destination!"),r("courier-admin")})});const v=document.getElementById("filter-audit-status"),$=document.getElementById("filter-audit-route"),I=document.getElementById("btn-reset-audit-filters");function C(){const t=v.value,s=$.value;document.querySelectorAll(".ledger-row").forEach(y=>{const h=y.getAttribute("data-status"),S=y.getAttribute("data-destination");(t==="ALL"||h===t)&&(s==="ALL"||S===s)?y.style.display="table-row":y.style.display="none"})}v.addEventListener("change",C),$.addEventListener("change",C),I.addEventListener("click",()=>{v.value="ALL",$.value="ALL",C()})}function ye(b,a,r){var t;const l=a.buses.filter(s=>s.status==="Active"),e=a.staff.drivers.filter(s=>s.status==="Available"),d=a.staff.conductors.filter(s=>s.status==="Available"),p=a.journeys.filter(s=>s.status==="Scheduled"||s.status==="In Transit");let c=((t=p[0])==null?void 0:t.id)||"",g=[];function v(){var D,z,i;const s=a.journeys.find(n=>n.id===c),u=s?a.buses.find(n=>n.id===s.busId):null,y=u?u.capacity:67,h=s?s.tickets:{},S=s&&((D=a.destinations.find(n=>n.name===s.routeTo))==null?void 0:D.ticketPrice)||3e4;b.innerHTML=`
      <div class="page-title-row">
        <div>
          <h2 style="color: var(--primary-blue);">🎟️ Bus Dispatch & Ticketing</h2>
          <p style="color: var(--text-medium); font-size: 0.9rem;">Roster departures, book passenger seats, and manage undercarriage commercial cargo</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
      </div>

      <div class="grid-3" style="grid-template-columns: 320px 1fr; gap: 1.5rem; align-items: start;">
        <!-- Column 1: Journey Selector & Roster Scheduling Form -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- 1. Select Active Journey -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-blue)">1. Select Departure</h3>
            </div>
            <div class="form-group">
              <label for="select-ticketing-journey">Active Journey Ticket Desk</label>
              <select id="select-ticketing-journey" style="margin-top: 4px;">
                ${p.map(n=>`
                  <option value="${n.id}" ${n.id===c?"selected":""}>
                    [${n.id.toUpperCase()}] ${n.routeFrom} ➔ ${n.routeTo} (${n.status})
                  </option>
                `).join("")}
                ${p.length===0?'<option value="">-- No Active Journeys --</option>':""}
              </select>
            </div>
            ${s?`
              <div style="font-size: 0.8rem; background: var(--primary-blue-light); padding: 10px; border-radius: 8px;">
                <div class="receipt-row"><span>Bus Assigned:</span><strong>${u?u.regNo:"N/A"}</strong></div>
                <div class="receipt-row"><span>Driver:</span><span>${((z=a.staff.drivers.find(n=>n.id===s.driverId))==null?void 0:z.name)||"N/A"}</span></div>
                <div class="receipt-row"><span>Conductor:</span><span>${((i=a.staff.conductors.find(n=>n.id===s.conductorId))==null?void 0:i.name)||"N/A"}</span></div>
                <div class="receipt-row"><span>Fare Rate:</span><strong>${E(S)}</strong></div>
              </div>
            `:""}
          </div>

          <!-- 2. Daily Roster Scheduler Form -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-maroon);">Create Route Roster</h3>
              <span class="badge badge-maroon">New Journey</span>
            </div>
            <form id="roster-form">
              <div class="form-group">
                <label for="rost-route">Destination Route</label>
                <select id="rost-route" required>
                  ${a.destinations.map(n=>`<option value="${n.id}">${n.name}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-bus">Assign Bus Fleet</label>
                <select id="rost-bus" required>
                  ${l.map(n=>`<option value="${n.id}">${n.regNo} (${n.model})</option>`).join("")}
                  ${l.length===0?'<option value="" disabled>No Buses Available</option>':""}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-driver">Assign Driver</label>
                <select id="rost-driver" required>
                  ${e.map(n=>`<option value="${n.id}">${n.name}</option>`).join("")}
                  ${e.length===0?'<option value="" disabled>No Drivers Available</option>':""}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-conductor">Assign Conductor</label>
                <select id="rost-conductor" required>
                  ${d.map(n=>`<option value="${n.id}">${n.name}</option>`).join("")}
                  ${d.length===0?'<option value="" disabled>No Conductors Available</option>':""}
                </select>
              </div>

              <div class="form-group">
                <label for="rost-time">Scheduled Departure Time</label>
                <input type="time" id="rost-time" required>
              </div>

              <button type="submit" class="btn btn-maroon btn-block btn-sm" ${l.length===0||e.length===0||d.length===0?"disabled":""}>
                📋 Schedule & Open Booking
              </button>
            </form>
          </div>
        </div>

        <!-- Column 2: 67-Seater Interactive Seating Layout & Ticketing Checkout -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${s?`
            <div class="grid-2" style="grid-template-columns: 1.1fr 0.9fr; gap: 1.5rem; align-items: start;">
              <!-- Seating cabin chart -->
              <div class="bus-seating-container">
                <div class="bus-layout-header">
                  <span style="font-weight: 700; color: var(--primary-blue);">67-SEATER BUS SEATING MAP</span>
                  <span class="badge badge-blue">${Object.keys(h).length} / ${y} Sold</span>
                </div>
                
                <div class="bus-cabin">
                  <!-- Front Cabin driver steering representation -->
                  <div class="cabin-front">
                    <div class="driver-seat">🎛️</div>
                    <div class="door-way">🚪 Entrance</div>
                  </div>

                  <!-- 67 Seat Layout (3 left, aisle, 2 right) -->
                  <div class="cabin-seats">
                    ${$(y,h)}
                  </div>
                </div>

                <div class="seat-legend">
                  <div class="legend-item"><div class="legend-box available"></div><span>Available</span></div>
                  <div class="legend-item"><div class="legend-box selected"></div><span>Selected</span></div>
                  <div class="legend-item"><div class="legend-box occupied"></div><span>Sold</span></div>
                </div>
              </div>

              <!-- Ticket Checkout & Undercarriage Cargo Manager -->
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Section A: Ticketing office booking -->
                <div class="card">
                  <div class="card-title-bar">
                    <h3 style="color: var(--primary-blue);">🎫 Ticket Checkout</h3>
                  </div>
                  
                  <div id="checkout-panel-content">
                    <p style="font-size: 0.8rem; color: var(--text-medium); margin-bottom: 1rem;">
                      Select vacant seat(s) on the bus cabin grid to activate ticket billing.
                    </p>

                    <form id="passenger-ticket-form" style="display: ${g.length>0?"block":"none"};">
                      <div class="form-group" style="background: var(--accent-gray-light); padding: 8px; border-radius: 6px;">
                        <span style="font-size: 0.85rem; font-weight: 600;">Selected Seats: </span>
                        <strong id="display-selected-seats" style="color: var(--primary-maroon); font-size: 1rem;">${g.join(", ")}</strong>
                      </div>

                      <div class="form-group">
                        <label for="tkt-name">Passenger Name</label>
                        <input type="text" id="tkt-name" placeholder="e.g. Kato Ivan" required>
                      </div>

                      <div class="form-group">
                        <label for="tkt-phone">Passenger Phone Number</label>
                        <input type="text" id="tkt-phone" placeholder="e.g. +256 782 112233" required>
                      </div>

                      <div style="margin-top: 1rem; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px;">
                        <div class="receipt-row">
                          <span>Fare Per Seat:</span>
                          <span>${E(S)}</span>
                        </div>
                        <div class="receipt-row" style="font-size: 1.25rem;">
                          <span>Total Amount:</span>
                          <strong style="color: var(--primary-blue);" id="display-total-fare">${E(S*g.length)}</strong>
                        </div>
                      </div>

                      <button type="submit" class="btn btn-blue btn-block btn-sm" style="margin-top: 10px;">
                        🖨️ Purchase & Print Tickets
                      </button>
                    </form>
                  </div>
                </div>

                <!-- Section B: Undercarriage cargo logger -->
                <div class="card">
                  <div class="card-title-bar">
                    <h3 style="color: var(--primary-maroon);">📦 Luggage & Undercarriage Cargo</h3>
                    <span class="badge badge-maroon">${s.cargo.length} Items</span>
                  </div>
                  
                  <form id="cargo-booking-form">
                    <div class="form-group">
                      <label for="crg-desc">Cargo Description</label>
                      <input type="text" id="crg-desc" placeholder="e.g. Bag of Mbale Coffee Beans, electronics carton" required>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="crg-weight">Est. Weight (kg)</label>
                        <input type="number" id="crg-weight" min="1" value="20" required>
                      </div>
                      <div class="form-group">
                        <label for="crg-charge">Cargo Loading Fee (UGX)</label>
                        <input type="number" id="crg-charge" min="1000" step="500" value="15000" required>
                      </div>
                    </div>

                    <button type="submit" class="btn btn-maroon btn-block btn-sm">
                      📦 Log Undercarriage Cargo
                    </button>
                  </form>

                  <!-- Brief Cargo list -->
                  ${s.cargo.length>0?`
                    <div style="margin-top: 10px; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px; max-height: 120px; overflow-y: auto;">
                      <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase;">Undercarriage Cargo Registry:</span>
                      <ul style="padding-left: 14px; font-size: 0.8rem; margin-top: 4px; display: flex; flex-direction: column; gap: 4px;">
                        ${s.cargo.map(n=>`
                          <li>${n.description} (${n.weightKg} kg) - <span style="font-weight:600; color:var(--primary-maroon);">${E(n.chargeUGX)}</span></li>
                        `).join("")}
                      </ul>
                    </div>
                  `:""}
                </div>
              </div>
            </div>
          `:`
            <div class="card" style="text-align: center; padding: 4rem 1rem;">
              <span style="font-size: 3rem;">🚌</span>
              <h3 style="color: var(--text-medium); margin-top: 10px;">No Active Journey Selected</h3>
              <p style="color: var(--text-light); max-width: 400px; margin: 6px auto;">
                Schedule a route on the left panel or check in to a current scheduled roster to access the interactive seat desk.
              </p>
            </div>
          `}
        </div>
      </div>
    `;const f=document.getElementById("roster-form");f&&f.addEventListener("submit",n=>{n.preventDefault();const x=document.getElementById("rost-route").value,B=document.getElementById("rost-bus").value,w=document.getElementById("rost-driver").value,P=document.getElementById("rost-conductor").value,A=document.getElementById("rost-time").value,T=a.destinations.find(F=>F.id===x);if(!T)return;const O=new Date,[U,J]=A.split(":");O.setHours(parseInt(U),parseInt(J),0,0);const j=_("JNY",3).toLowerCase();r("update-state",F=>{const Y=F.staff.drivers.find(N=>N.id===w);Y&&(Y.status="On Duty");const H=F.staff.conductors.find(N=>N.id===P);H&&(H.status="On Duty");const q={id:j,busId:B,routeFrom:"Kampala",routeTo:T.name,driverId:w,conductorId:P,departureTime:O.toISOString(),status:"Scheduled",progress:0,currentLocation:"Kampala Terminal",routePath:["Kampala","Jinja","Iganga","Mbale","Soroti","Lira","Gulu"].slice(0,4),tickets:{},expenses:[],cargo:[]};return F.journeys.unshift(q),F}),alert(`Journey scheduled and registered successfully under code ${j.toUpperCase()}!`),c=j,r("bus-handler")}),document.querySelectorAll(".seat:not(.occupied)").forEach(n=>{n.addEventListener("click",x=>{const B=parseInt(x.target.getAttribute("data-seat"));g.includes(B)?(g=g.filter(T=>T!==B),x.target.classList.remove("selected")):(g.push(B),x.target.classList.add("selected"));const w=document.getElementById("passenger-ticket-form"),P=document.getElementById("display-selected-seats"),A=document.getElementById("display-total-fare");g.length>0?(w.style.display="block",P.textContent=g.join(", "),A.textContent=E(S*g.length)):w.style.display="none"})});const m=document.getElementById("passenger-ticket-form");m&&m.addEventListener("submit",n=>{n.preventDefault();const x=document.getElementById("tkt-name").value,B=document.getElementById("tkt-phone").value,w=[];r("update-state",P=>{const A=P.journeys.find(T=>T.id===c);return A&&g.forEach(T=>{const U={ticketId:`YY-TKT-${Math.floor(1e5+Math.random()*9e5)}`,seatNo:T,passengerName:x,passengerPhone:B,amountPaid:S,purchaseDate:new Date().toISOString(),status:"CheckedIn"};A.tickets[T]=U,w.push(U)}),P}),C(w,s),g=[],v()});const k=document.getElementById("cargo-booking-form");k&&k.addEventListener("submit",n=>{n.preventDefault();const x=document.getElementById("crg-desc").value,B=parseFloat(document.getElementById("crg-weight").value)||10,w=parseFloat(document.getElementById("crg-charge").value)||1e4;r("update-state",P=>{const A=P.journeys.find(T=>T.id===c);return A&&A.cargo.push({id:`crg-pkg-${Math.floor(1e3+Math.random()*9e3)}`,description:x,weightKg:B,chargeUGX:w,status:"Loaded"}),P}),alert("Commercial cargo loaded into bus undercarriage!"),v()});const L=document.getElementById("select-ticketing-journey");L&&L.addEventListener("change",n=>{c=n.target.value,g=[],v()}),document.getElementById("btn-back-portal").addEventListener("click",()=>r("portal"))}function $(s,u){let y="",h=1;const S=Math.ceil(s/5);for(let f=0;f<S;f++){y+='<div class="seat-row">';for(let o=0;o<3;o++)h<=s?(y+=I(h,u),h++):y+="<div></div>";y+='<div class="seat-aisle"></div>';for(let o=0;o<2;o++)h<=s?(y+=I(h,u),h++):y+="<div></div>";y+="</div>"}return y}function I(s,u){const y=u[s]!==void 0,h=u[s];return y?`
        <div class="seat occupied" data-seat="${s}">
          ${s}
          <div class="seat-tooltip">
            <strong>${h.passengerName}</strong><br>
            Phone: ${h.passengerPhone}<br>
            Tkt: ${h.ticketId}<br>
            Paid: ${E(h.amountPaid)}
          </div>
        </div>
      `:`
        <div class="seat ${g.includes(s)?"selected":""}" data-seat="${s}">
          ${s}
        </div>
      `}function C(s,u){const y=document.createElement("div");y.className="modal-overlay",y.style.display="flex";const h=a.buses.find(f=>f.id===u.busId),S=s.map(f=>{const o=ue(f.ticketId);return`
        <div class="simulated-receipt print-tkt-section" style="width: 100%; border: 2px dashed #000; padding: 1rem; margin-bottom: 1.5rem; background: #fff;">
          <div class="receipt-header">
            <strong style="font-size: 1.2rem; color: #7a0016; letter-spacing: 1px;">YY BUSES UGANDA</strong>
            <span style="font-size: 0.65rem; display: block; text-transform: uppercase;">Quality Services, Safe Journeys</span>
            <strong style="font-size: 0.85rem; display: block; border: 1px solid #000; margin-top: 4px; padding: 2px;">BOARDING PASS PASSENGER TICKET</strong>
          </div>

          <div class="receipt-row"><span>Ticket No:</span><strong style="font-family: monospace;">${f.ticketId}</strong></div>
          <div class="receipt-row"><span>Roster Voyage:</span><strong>${u.routeFrom} ➔ ${u.routeTo}</strong></div>
          <div class="receipt-row"><span>Departure Time:</span><span>${K(u.departureTime)}</span></div>
          <div class="receipt-row"><span>Bus Reg No:</span><strong style="font-family: monospace;">${h?h.regNo:"N/A"}</strong></div>
          <div class="receipt-divider"></div>

          <div class="receipt-row"><span>Passenger:</span><strong>${f.passengerName}</strong></div>
          <div class="receipt-row"><span>Phone:</span><span>${f.passengerPhone}</span></div>
          <div class="receipt-row" style="font-size: 1.3rem; border: 2px solid #000; padding: 4px; text-align: center; margin: 10px 0; justify-content: center; font-weight: 900;">
            SEAT NO: ${f.seatNo}
          </div>
          
          <div class="receipt-divider"></div>
          <div class="receipt-row"><span>Fare Paid:</span><strong>${E(f.amountPaid)}</strong></div>
          <div style="font-size: 0.6rem; text-align: center; margin-top: 6px; color: #555;">
            * Tickets are non-refundable. Please report 30 minutes before departure.
          </div>

          <div class="receipt-barcode">
            ${o}
          </div>
        </div>
      `}).join("");y.innerHTML=`
      <div class="modal-content" style="max-width: 420px;">
        <button class="modal-close" id="btn-close-print-modal">×</button>
        <h3 style="margin-bottom: 1rem; color: var(--primary-blue); text-align: center;">Ticket Printing Office</h3>
        <p style="font-size: 0.8rem; text-align: center; margin-bottom: 1rem; color: var(--text-medium)">
          Verify details and trigger printing for passenger boarding.
        </p>

        <div id="print-area-tickets" style="max-height: 450px; overflow-y: auto; padding-right: 5px;">
          ${S}
        </div>

        <button class="btn btn-blue btn-block" id="btn-trigger-ticket-print" style="margin-top: 1rem;">
          🖨️ Send to Ticket Printer
        </button>
      </div>
    `,document.body.appendChild(y),document.getElementById("btn-close-print-modal").addEventListener("click",()=>{document.body.removeChild(y)}),document.getElementById("btn-trigger-ticket-print").addEventListener("click",()=>{const f=document.createElement("div");f.className="print-only-container",f.innerHTML=document.getElementById("print-area-tickets").innerHTML,document.body.appendChild(f),window.print(),document.body.removeChild(f),document.body.removeChild(y)})}v()}function fe(b,a,r){var p;const l=a.journeys.filter(c=>c.status==="Scheduled"||c.status==="In Transit");let e=((p=l[0])==null?void 0:p.id)||"";function d(){const c=a.journeys.find(o=>o.id===e),g=c?a.buses.find(o=>o.id===c.busId):null,v=g?g.capacity:67,$=c?c.tickets:{},I=Object.values($).reduce((o,m)=>o+m.amountPaid,0),C=c?c.expenses.reduce((o,m)=>o+m.amount,0):0;b.innerHTML=`
      <div class="page-title-row">
        <div>
          <h2 style="color: var(--primary-maroon);">📱 Bus Conductor Log</h2>
          <p style="color: var(--text-medium); font-size: 0.9rem;">Mobile terminal for checkpoint logs, roadside sales, and expense entries</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
      </div>

      <!-- Select active voyage -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="form-group" style="margin-bottom: 0;">
          <label for="conductor-journey-select" style="font-weight: 700;">Select Your Assigned Active Voyage</label>
          <select id="conductor-journey-select" style="margin-top: 4px;">
            ${l.map(o=>`
              <option value="${o.id}" ${o.id===e?"selected":""}>
                [${o.id.toUpperCase()}] ${o.routeFrom} ➔ ${o.routeTo} (${o.status})
              </option>
            `).join("")}
            ${l.length===0?'<option value="">-- No Active Journeys to Manage --</option>':""}
          </select>
        </div>
      </div>

      ${c?`
        <!-- Mobile dashboard summary grid -->
        <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 1.5rem;">
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">💰</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Fare Cash</span>
              <span class="stat-value" style="font-size: 1.15rem; color: var(--success);">${E(I)}</span>
            </div>
          </div>
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">⛽</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Expenses</span>
              <span class="stat-value" style="font-size: 1.15rem; color: var(--danger);">${E(C)}</span>
            </div>
          </div>
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">🎟️</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Passengers</span>
              <span class="stat-value" style="font-size: 1.15rem;">${Object.keys($).length} / ${v}</span>
            </div>
          </div>
          <div class="stat-card" style="padding: 10px; gap: 8px;">
            <div style="font-size: 1.25rem;">📍</div>
            <div class="stat-info">
              <span class="stat-label" style="font-size: 0.7rem;">Location</span>
              <span class="stat-value" style="font-size: 1.15rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 110px;">${c.currentLocation}</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Section 1: Journey Progression Checkpoint Log -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-maroon)">📍 Route Progression Checkpoints</h3>
              <span class="badge badge-maroon">${c.progress}% Done</span>
            </div>
            
            <div style="margin: 1rem 0;">
              <span style="font-size: 0.85rem; color: var(--text-medium); font-weight: 600;">Current Station Stop:</span>
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary-blue); margin-top: 2px;">
                🏢 ${c.currentLocation}
              </div>
            </div>

            <!-- Progression actions -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 1.5rem;">
              <label style="font-weight: 700;">Check-in to next Uganda Transit Stop:</label>
              
              ${c.status==="Scheduled"?`
                <button class="btn btn-blue btn-block" id="btn-start-journey">
                  🏁 Depart Kampala Terminal (Start Voyage)
                </button>
              `:c.status==="In Transit"?`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <button class="btn btn-secondary btn-sm" id="btn-advance-stop">
                    📍 Arrived next Hub stop
                  </button>
                  <button class="btn btn-success btn-sm" id="btn-complete-journey">
                    🏁 Complete Journey
                  </button>
                </div>
              `:`
                <div style="text-align: center; color: var(--success); font-weight: 700; padding: 10px; background: var(--success-light); border-radius: 6px;">
                  ✓ Journey Completed at Final Hub
                </div>
              `}
            </div>
          </div>

          <!-- Section 2: Operational Expense Logger -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-maroon)">⛽ Log Route Expense</h3>
              <span class="badge badge-danger">${c.expenses.length} Entries</span>
            </div>
            
            <form id="conductor-expense-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="exp-category">Expense Type</label>
                  <select id="exp-category" required>
                    <option value="Fuel">Fuel stop</option>
                    <option value="Police/Tolls">Traffic Police / Toll gate</option>
                    <option value="Meals">Conductor/Driver Meals</option>
                    <option value="Maintenance">Emergency repairs</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exp-amount">Amount paid (UGX)</label>
                  <input type="number" id="exp-amount" min="500" step="500" value="20000" required>
                </div>
              </div>

              <div class="form-group">
                <label for="exp-desc">Detailed Description</label>
                <input type="text" id="exp-desc" placeholder="e.g. 50 liters diesel shell Jinja, Highway police checkpoint ticket" required>
              </div>

              <button type="submit" class="btn btn-maroon btn-sm btn-block">
                💾 Log Operational Expense
              </button>
            </form>

            <!-- Exp ledger list -->
            ${c.expenses.length>0?`
              <div style="margin-top: 10px; border-top: 1px solid var(--accent-gray-medium); padding-top: 10px; max-height: 120px; overflow-y: auto;">
                <table style="font-size: 0.8rem;">
                  <thead>
                    <tr><th>Type</th><th>Description</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    ${c.expenses.map(o=>`
                      <tr>
                        <td><strong>${o.category}</strong></td>
                        <td>${o.description}</td>
                        <td style="color: var(--danger); font-weight:600;">-${E(o.amount)}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `:""}
          </div>
        </div>

        <div class="grid-2" style="margin-top: 1.5rem;">
          <!-- Section 3: Mid-Journey Ticket Seller (Waysiders) -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-blue)">🎟️ Sell Waysider Cash Ticket</h3>
              <span class="badge badge-blue">Roadside cash sales</span>
            </div>
            
            <form id="wayside-sale-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="way-seat">Choose Vacant Seat</label>
                  <select id="way-seat" required>
                    ${Array.from({length:v}).map((o,m)=>{const k=m+1;return $[k]?"":`<option value="${k}">Seat #${k}</option>`}).join("")}
                  </select>
                </div>
                <div class="form-group">
                  <label for="way-fare">Midway Fare (UGX)</label>
                  <input type="number" id="way-fare" value="25000" min="5000" step="1000" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="way-name">Wayside Passenger Name</label>
                  <input type="text" id="way-name" value="Waysider Client" required>
                </div>
                <div class="form-group">
                  <label for="way-phone">Phone Number</label>
                  <input type="text" id="way-phone" value="+256 " required>
                </div>
              </div>

              <button type="submit" class="btn btn-blue btn-sm btn-block">
                💾 Log Cash Ticket Sale
              </button>
            </form>
          </div>

          <!-- Section 4: Passenger Seating Manifest & Boarding verification -->
          <div class="card">
            <div class="card-title-bar">
              <h3 style="color: var(--primary-blue)">📋 Seat Boarding Manifest</h3>
              <span class="badge badge-success">${Object.keys($).length} Booked</span>
            </div>
            
            <div class="table-wrapper" style="max-height: 280px; overflow-y: auto;">
              <table>
                <thead>
                  <tr>
                    <th>Seat</th>
                    <th>Passenger</th>
                    <th>Status</th>
                    <th>Validation Code</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.values($).sort((o,m)=>o.seatNo-m.seatNo).map(o=>`
                    <tr>
                      <td><strong>Seat ${o.seatNo}</strong></td>
                      <td>
                        <strong>${o.passengerName}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-light)">${o.passengerPhone}</div>
                      </td>
                      <td>
                        <span class="badge ${o.status==="Boarded"?"badge-success":"badge-warning"}">
                          ${o.status||"CheckedIn"}
                        </span>
                      </td>
                      <td>
                        ${o.status!=="Boarded"?`<button class="btn btn-xs btn-success btn-board-manifest" data-seat="${o.seatNo}">Board</button>`:'<span style="font-size: 0.75rem; color: var(--text-light);">On Board</span>'}
                      </td>
                    </tr>
                  `).join("")}
                  ${Object.keys($).length===0?`
                    <tr><td colspan="4" style="text-align: center; color: var(--text-light)">Manifest empty. No passenger tickets sold.</td></tr>
                  `:""}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `:`
        <div class="card" style="text-align: center; padding: 4rem 1rem;">
          <span style="font-size: 3rem;">📋</span>
          <h3 style="color: var(--text-medium); margin-top: 10px;">No Active Journey Assinged</h3>
          <p style="color: var(--text-light); max-width: 400px; margin: 6px auto;">
            Ensure there is an active scheduled bus route dispatched in the system to load the mobile conductor terminal.
          </p>
        </div>
      `}
    `;const t=document.getElementById("btn-start-journey"),s=document.getElementById("btn-advance-stop"),u=document.getElementById("btn-complete-journey");t&&t.addEventListener("click",()=>{r("update-state",o=>{const m=o.journeys.find(k=>k.id===e);return m&&(m.status="In Transit",m.currentLocation="Kampala (Departed)",m.progress=10),o}),alert("Bus has departed Kampala Terminal! Voyage is now live."),d()}),s&&s.addEventListener("click",()=>{const o=prompt("Enter the name of the next checkpoint/town the bus has reached (e.g. Jinja, Iganga, Mbale):");o&&(r("update-state",m=>{const k=m.journeys.find(L=>L.id===e);return k&&(k.currentLocation=o,k.progress=Math.min(k.progress+25,90)),m}),d())}),u&&u.addEventListener("click",()=>{r("update-state",o=>{const m=o.journeys.find(k=>k.id===e);if(m){m.status="Completed",m.currentLocation=m.routeTo,m.progress=100;const k=o.staff.drivers.find(D=>D.id===m.driverId);k&&(k.status="Available");const L=o.staff.conductors.find(D=>D.id===m.conductorId);L&&(L.status="Available")}return o}),alert("Voyage complete! Bus arrived at final terminal. Resources returned to roster."),d()});const y=document.getElementById("conductor-expense-form");y&&y.addEventListener("submit",o=>{o.preventDefault();const m=document.getElementById("exp-category").value,k=parseFloat(document.getElementById("exp-amount").value)||0,L=document.getElementById("exp-desc").value;r("update-state",D=>{const z=D.journeys.find(i=>i.id===e);return z&&z.expenses.push({id:`exp-${Math.floor(1e3+Math.random()*9e3)}`,category:m,description:L,amount:k,time:new Date().toISOString()}),D}),alert("Operational route expense logged!"),d()});const h=document.getElementById("wayside-sale-form");h&&h.addEventListener("submit",o=>{o.preventDefault();const m=parseInt(document.getElementById("way-seat").value),k=parseFloat(document.getElementById("way-fare").value)||2e4,L=document.getElementById("way-name").value,D=document.getElementById("way-phone").value,z=`YY-TKT-${Math.floor(1e5+Math.random()*9e5)}`;r("update-state",i=>{const n=i.journeys.find(x=>x.id===e);return n&&(n.tickets[m]={ticketId:z,seatNo:m,passengerName:L,passengerPhone:D,amountPaid:k,purchaseDate:new Date().toISOString(),status:"Boarded"}),i}),alert(`Logged mid-journey passenger ticket sale for Seat #${m}!`),d()}),document.querySelectorAll(".btn-board-manifest").forEach(o=>{o.addEventListener("click",m=>{const k=parseInt(m.target.getAttribute("data-seat"));r("update-state",L=>{const D=L.journeys.find(z=>z.id===e);return D&&D.tickets[k]&&(D.tickets[k].status="Boarded"),L}),d()})});const f=document.getElementById("conductor-journey-select");f&&f.addEventListener("change",o=>{e=o.target.value,d()}),document.getElementById("btn-back-portal").addEventListener("click",()=>r("portal"))}d()}function ke(b,a,r){var C;let l=0,e=0,d=0,p=0,c=0;a.journeys.forEach(t=>{const s=Object.values(t.tickets).reduce((h,S)=>h+S.amountPaid,0);l+=s;const u=t.cargo.reduce((h,S)=>h+S.chargeUGX,0);e+=u;const y=t.expenses.reduce((h,S)=>h+S.amount,0);if(d+=y,t.status==="Completed"){const h=a.buses.find(S=>S.id===t.busId);p+=Object.keys(t.tickets).length,c+=h?h.capacity:67}});const g=l+e,v=g-d,$=c>0?p/c*100:82.5,I=a.journeys.find(t=>t.status==="In Transit");b.innerHTML=`
    <div class="page-title-row">
      <div>
        <h2 style="color: var(--primary-blue);">📊 Bus Operations Analytics</h2>
        <p style="color: var(--text-medium); font-size: 0.9rem;">Consolidated business metrics, live vehicle dispatch positioning, and roster status</p>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-back-portal">🏠 Home Portal</button>
    </div>

    <!-- Manager Financials widget row -->
    <div class="stats-grid">
      <div class="stat-card" style="border-top: 4px solid var(--primary-blue);">
        <div class="stat-icon blue">💰</div>
        <div class="stat-info">
          <span class="stat-label">Total Bus Revenues</span>
          <span class="stat-value" style="color: var(--primary-blue); font-size: 1.5rem;">${E(g)}</span>
          <span class="stat-trend" style="color: var(--text-light)">Ticketing + Cargo luggage</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--danger);">
        <div class="stat-icon" style="background: var(--danger);">⛽</div>
        <div class="stat-info">
          <span class="stat-label">Route Expenditures</span>
          <span class="stat-value" style="color: var(--danger); font-size: 1.5rem;">-${E(d)}</span>
          <span class="stat-trend trend-down">▼ Conductor disbursements</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--success);">
        <div class="stat-icon success">📈</div>
        <div class="stat-info">
          <span class="stat-label">Net Operating Profit</span>
          <span class="stat-value" style="color: var(--success); font-size: 1.5rem;">${E(v)}</span>
          <span class="stat-trend trend-up">▲ UGX Net Income</span>
        </div>
      </div>
      <div class="stat-card" style="border-top: 4px solid var(--info);">
        <div class="stat-icon info">👥</div>
        <div class="stat-info">
          <span class="stat-label">Seating Efficiency</span>
          <span class="stat-value">${$.toFixed(1)}%</span>
          <span class="stat-trend trend-up">▲ Avg completed load</span>
        </div>
      </div>
    </div>

    <!-- Visual Revenue Proportions -->
    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-title-bar">
        <h3>📊 Revenue vs Expense Apportionment</h3>
      </div>
      <div class="revenue-progress-bar">
        <div class="rev-portion rev-tickets" style="width: ${l/(g||1)*100}%;">
          Tickets: ${E(l)}
        </div>
        <div class="rev-portion rev-cargo" style="width: ${e/(g||1)*100}%;">
          Cargo: ${E(e)}
        </div>
      </div>
      <div style="display: flex; gap: 20px; font-size: 0.8rem; margin-top: 8px;">
        <div><span style="display:inline-block; width:12px; height:12px; background:var(--primary-blue); margin-right:6px; vertical-align:middle; border-radius:3px;"></span>Ticket Sales</div>
        <div><span style="display:inline-block; width:12px; height:12px; background:var(--primary-maroon); margin-right:6px; vertical-align:middle; border-radius:3px;"></span>Undercarriage Cargo</div>
        <div><span style="display:inline-block; width:12px; height:12px; background:var(--danger); margin-right:6px; vertical-align:middle; border-radius:3px;"></span>Logged Expenses (${(d/(g||1)*100).toFixed(1)}% of gross)</div>
      </div>
    </div>

    <!-- Live Corridor Journey Map Monitor -->
    <div class="card" style="margin-bottom: 2rem;">
      <div class="card-title-bar">
        <h3>📍 Live Journey Corridor Monitor</h3>
        <span class="badge badge-maroon">Active Bus Positioning</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-medium); margin-bottom: 1rem;">
        Real-time GPS tracking simulator representing YY buses currently traveling along the Kampala-Eastern Highway corridor:
      </p>

      <div class="timeline-map-container">
        ${I?`
          <div class="uganda-map-grid">
            <div style="font-weight: 700; color: var(--primary-blue); margin-bottom: 5px; font-size: 0.9rem; text-align: center;">
              Active Voyage: Voyage #${I.id.toUpperCase()} (Kampala to ${I.routeTo})
            </div>
            
            <div class="map-corridor-row">
              <!-- Background highway line -->
              <div class="map-corridor-line"></div>
              <div class="map-corridor-line-progress" style="width: ${I.progress}%;"></div>
              
              <!-- Checkpoint Nodes -->
              <div class="map-station-node active-passed">
                KLA
                <span class="station-label">Kampala</span>
              </div>
              <div class="map-station-node ${I.progress>=30?I.currentLocation.toLowerCase().includes("jinja")?"active-current":"active-passed":""}">
                JJA
                <span class="station-label">Jinja</span>
              </div>
              <div class="map-station-node ${I.progress>=60?I.currentLocation.toLowerCase().includes("iganga")?"active-current":"active-passed":""}">
                IGA
                <span class="station-label">Iganga</span>
              </div>
              <div class="map-station-node ${I.progress>=90?"active-current":""}">
                MBL
                <span class="station-label">Mbale final</span>
              </div>

              <!-- Pulser Avatar position -->
              <div class="bus-pulsing-avatar" style="left: calc(${I.progress}% - 35px);">
                🚌 ${((C=a.buses.find(t=>t.id===I.busId))==null?void 0:C.regNo)||"BUS"}
              </div>
            </div>
          </div>
        `:`
          <div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-light); flex-direction:column; gap:10px;">
            <span style="font-size:3rem;">🛰️</span>
            <strong>No bus journeys are currently in-transit on Ugandan corridors.</strong>
            <span style="font-size:0.8rem;">Monitor active departures by dispatching scheduled buses.</span>
          </div>
        `}
      </div>
    </div>

    <div class="grid-2">
      <!-- Active Departures Table -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-title-bar">
          <h3>📋 Active departures & Dispatch logs</h3>
          <span class="badge badge-blue">${a.journeys.length} logs</span>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Voyage ID</th>
                <th>Route Corridor</th>
                <th>Bus Info</th>
                <th>Crew (Driver/Conductor)</th>
                <th>Departure Time</th>
                <th>Cargo loaded</th>
                <th>Finances</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${a.journeys.map(t=>{const s=a.buses.find(m=>m.id===t.busId),u=a.staff.drivers.find(m=>m.id===t.driverId),y=a.staff.conductors.find(m=>m.id===t.conductorId),h=Object.values(t.tickets).reduce((m,k)=>m+k.amountPaid,0),S=t.cargo.reduce((m,k)=>m+k.chargeUGX,0),f=t.expenses.reduce((m,k)=>m+k.amount,0),o=h+S-f;return`
                  <tr>
                    <td><strong>${t.id.toUpperCase()}</strong></td>
                    <td>${t.routeFrom} ➔ ${t.routeTo}</td>
                    <td>
                      <div><strong>${s?s.regNo:"N/A"}</strong></div>
                      <div style="font-size: 0.75rem; color: var(--text-light);">${s?s.model:"N/A"}</div>
                    </td>
                    <td>
                      <div style="font-size: 0.85rem;">👨‍✈️ D: ${u?u.name.split(" ")[0]:"N/A"}</div>
                      <div style="font-size: 0.85rem;">📋 C: ${y?y.name.split(" ")[0]:"N/A"}</div>
                    </td>
                    <td>${K(t.departureTime)}</td>
                    <td>${t.cargo.length} items (${t.cargo.reduce((m,k)=>m+k.weightKg,0)} kg)</td>
                    <td>
                      <div style="font-size:0.85rem; color:var(--success);">Rev: ${E(h+S)}</div>
                      <div style="font-size:0.85rem; color:var(--danger);">Exp: -${E(f)}</div>
                      <div style="font-weight:700; font-size:0.85rem;">Net: ${E(o)}</div>
                    </td>
                    <td>
                      <span class="badge ${t.status==="Completed"?"badge-success":t.status==="In Transit"?"badge-maroon":t.status==="Scheduled"?"badge-blue":"badge-danger"}">
                        ${t.status}
                      </span>
                    </td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Fleet registry states -->
      <div class="card">
        <div class="card-title-bar">
          <h3>🚌 Fleet Status Registry</h3>
          <span class="badge badge-secondary">${a.buses.length} Buses</span>
        </div>
        <div class="table-wrapper" style="max-height: 250px;">
          <table>
            <thead>
              <tr><th>Reg No</th><th>Specs</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${a.buses.map(t=>`
                <tr>
                  <td><strong>${t.regNo}</strong></td>
                  <td>${t.model}</td>
                  <td>
                    <span class="badge ${t.status==="Active"?"badge-success":"badge-warning"}">
                      ${t.status}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Staff duty details -->
      <div class="card">
        <div class="card-title-bar">
          <h3>👨‍✈️ Crew Duty Status Roster</h3>
        </div>
        <div class="table-wrapper" style="max-height: 250px;">
          <table>
            <thead>
              <tr><th>Name</th><th>Role</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${a.staff.drivers.map(t=>`
                <tr>
                  <td><strong>${t.name}</strong></td>
                  <td>Driver</td>
                  <td>
                    <span class="badge ${t.status==="Available"?"badge-success":"badge-maroon"}">
                      ${t.status}
                    </span>
                  </td>
                </tr>
              `).join("")}
              ${a.staff.conductors.map(t=>`
                <tr>
                  <td><strong>${t.name}</strong></td>
                  <td>Conductor</td>
                  <td>
                    <span class="badge ${t.status==="Available"?"badge-success":"badge-maroon"}">
                      ${t.status}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,document.getElementById("btn-back-portal").addEventListener("click",()=>r("portal"))}let M=ce(),G="portal",te={};window.addEventListener("yy_state_changed",b=>{M=b.detail});function R(b,a={}){if(b==="update-state"&&typeof a=="function"){M=a(M),pe(M),W();return}G=b,te=a,W()}const ee={"bus-handler":{title:"Bus Desk (Handler)",themeClass:"active-blue",links:[{name:"🎟️ Booking & Roster",view:"bus-handler"},{name:"📊 Fleet Analytics",view:"bus-manager"},{name:"🗺️ Public Rates",view:"destinations"}]},"bus-conductor":{title:"Voyage Log (Conductor)",themeClass:"active-maroon",links:[{name:"📱 Mobile Desk",view:"bus-conductor"},{name:"🗺️ Public Rates",view:"destinations"}]},"bus-manager":{title:"Operations (Manager)",themeClass:"active-blue",links:[{name:"📊 Fleet Analytics",view:"bus-manager"},{name:"🎟️ Dispatch Board",view:"bus-handler"},{name:"🗺️ Public Rates",view:"destinations"}]},"courier-client":{title:"YY Courier Client",themeClass:"active-maroon",links:[{name:"🔍 Track & Pre-Book",view:"courier-client"},{name:"🗺️ Pricing Directory",view:"destinations"}]},"courier-handler":{title:"Parcel counter (Handler)",themeClass:"active-maroon",links:[{name:"📥 Intake & Dispatch",view:"courier-handler"},{name:"📊 Audit Records",view:"courier-admin"},{name:"🗺️ Price Sheet",view:"destinations"}]},"courier-admin":{title:"Logistics (Admin)",themeClass:"active-maroon",links:[{name:"📊 Rates & Auditing",view:"courier-admin"},{name:"📥 Counter Intake",view:"courier-handler"},{name:"🗺️ Price Sheet",view:"destinations"}]}};function W(){const b=document.getElementById("app");if(!b)return;const a=ee[G]!==void 0,r=ee[G];b.innerHTML=`
    <!-- Top Nav Header -->
    <header class="app-header">
      <div class="logo-section" id="brand-logo-btn">
        <div class="logo-icon">YY</div>
        <div class="logo-text">
          <h1>YY BUSES</h1>
          <span>Uganda Transport & Courier</span>
        </div>
      </div>

      <div class="nav-actions">
        ${G!=="portal"?`
          <div class="portal-badge">
            ⚡ ${G.replace("-"," ").toUpperCase()} Mode
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-header-logout" style="background: rgba(255,255,255,0.15); color: var(--text-white); border: none;">
            🚪 Exit Desk
          </button>
        `:""}
        <button class="btn-icon" id="theme-toggle-btn" title="Toggle Dark/Light Mode">🌓</button>
      </div>
    </header>

    <!-- Main Body Container -->
    <div class="dashboard-container">
      <!-- Dynamic Sidebar -->
      ${a?`
        <aside class="sidebar">
          <div style="margin-bottom: 1rem;">
            <span class="sidebar-title">${r.title}</span>
            <div style="font-size: 0.8rem; color: var(--text-medium); margin-top: 4px; padding-left: 8px;">
              User: Branch Officer
            </div>
          </div>
          <nav>
            <ul class="menu-list">
              ${r.links.map(p=>`
                <li class="menu-item ${p.view===G?r.themeClass:""}" data-view="${p.view}">
                  ${p.name}
                </li>
              `).join("")}
            </ul>
          </nav>

          <div style="margin-top: auto; padding: 10px; background: var(--accent-gray-light); border-radius: var(--border-radius-md); font-size: 0.75rem; text-align: center; border: 1px solid var(--panel-border);">
            <strong>YY Buses Kampala</strong><br>
            Terminal System v1.2
          </div>
        </aside>
      `:""}

      <!-- Main Workspace View -->
      <main class="workspace" style="${a?"":"grid-column: span 2;"}" id="workspace-view">
        <!-- Dashboard components render here -->
      </main>
    </div>
  `,document.getElementById("brand-logo-btn").addEventListener("click",()=>R("portal"));const l=document.getElementById("btn-header-logout");l&&l.addEventListener("click",()=>R("portal")),document.getElementById("theme-toggle-btn").addEventListener("click",()=>{document.body.classList.toggle("dark-theme");const p=document.body.classList.contains("dark-theme");localStorage.setItem("yy_theme_dark",p?"true":"false")}),a&&document.querySelectorAll(".menu-item").forEach(p=>{p.addEventListener("click",c=>{const g=c.target.getAttribute("data-view");R(g)})});const d=document.getElementById("workspace-view");switch(G){case"portal":Z(d,M,R);break;case"destinations":ge(d,M,R);break;case"courier-client":ve(d,M,R,te);break;case"courier-handler":be(d,M,R);break;case"courier-admin":he(d,M,R);break;case"bus-handler":ye(d,M,R);break;case"bus-conductor":fe(d,M,R);break;case"bus-manager":ke(d,M,R);break;default:Z(d,M,R)}}function xe(){localStorage.getItem("yy_theme_dark")==="true"&&document.body.classList.add("dark-theme"),W()}window.onload=xe;
