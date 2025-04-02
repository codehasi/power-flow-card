(()=>{"use strict";const t={solar:"M11.45,2V5.55L15,3.77L11.45,2M10.45,8L8,10.46L11.75,11.71L10.45,8M2,11.45L3.77,15L5.55,11.45H2M10,2H2V10C2.57,10.17 3.17,10.25 3.77,10.25C7.35,10.26 10.26,7.35 10.27,3.75C10.26,3.16 10.17,2.57 10,2M17,22V16H14L19,7V13H22L17,22Z",grid:"M8.28,5.45L6.5,4.55L7.76,2H16.23L17.5,4.55L15.72,5.44L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.45L19.89,10.56L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z",battery:"M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z",home:"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",consumer:"M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"};class e extends HTMLElement{constructor(){super(),this.config=null,this.attachShadow({mode:"open"})}static get properties(){return{config:{type:Object}}}set hass(t){}setConfig(t){this.config=t,this.render()}createSVGElement(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}createFlowLine(t,e,n,s,r){const o=this.createSVGElement("path"),i=n-t,a=s-e,h=Math.min(Math.abs(i),100),c=Math.atan2(a,i),l=t+32*Math.cos(c),d=e+32*Math.sin(c),f=n-32*Math.cos(c),p=s-32*Math.sin(c),u=`M ${l} ${d} C ${l+h} ${d}, ${f-h} ${p}, ${f} ${p}`;o.setAttribute("d",u),o.setAttribute("fill","none"),o.setAttribute("stroke",r>=0?"#4CAF50":"#F44336"),o.setAttribute("stroke-width","2");const L=this.config?.animationSpeed||2,b=r>=0?L:-L;return o.innerHTML="\n      <style>\n        @keyframes flow-positive {\n          from { stroke-dashoffset: 24; }\n          to { stroke-dashoffset: 0; }\n        }\n        @keyframes flow-negative {\n          from { stroke-dashoffset: 0; }\n          to { stroke-dashoffset: 24; }\n        }\n      </style>\n    ",o.style.strokeDasharray="8,4",o.style.animation=`flow-${r>=0?"positive":"negative"} ${Math.abs(b)}s linear infinite`,o}createIcon(e,n,s,r,o){const i=this.createSVGElement("g");i.setAttribute("transform",`translate(${n},${s})`);const a=this.createSVGElement("circle");a.setAttribute("cx","0"),a.setAttribute("cy","0"),a.setAttribute("r","32"),a.setAttribute("fill","var(--ha-card-background, #fff)"),a.setAttribute("stroke","var(--primary-text-color, #000)"),a.setAttribute("stroke-width","1");const h=this.createSVGElement("path");h.setAttribute("d",t[e]),h.setAttribute("transform","translate(-12, -26)"),h.setAttribute("fill","var(--primary-text-color, #000)");const c=this.createSVGElement("text");c.setAttribute("x","0"),c.setAttribute("y","8"),c.setAttribute("text-anchor","middle"),c.setAttribute("class","label"),c.textContent=o;const l=this.createSVGElement("text");return l.setAttribute("x","0"),l.setAttribute("y","22"),l.setAttribute("text-anchor","middle"),l.setAttribute("class","power-value"),l.textContent=`${Math.abs(r)}W`,i.appendChild(a),i.appendChild(h),i.appendChild(c),i.appendChild(l),i}render(){if(!this.shadowRoot||!this.config)return;const t=this.config.width||800,e=this.config.height||400;this.shadowRoot.innerHTML=`\n      <style>\n        :host {\n          display: block;\n          padding: 16px;\n          background: var(--ha-card-background, #fff);\n          border-radius: var(--ha-card-border-radius, 4px);\n          box-shadow: var(--ha-card-box-shadow, 0 2px 2px rgba(0, 0, 0, 0.1));\n        }\n        svg {\n          width: 100%;\n          height: auto;\n        }\n        text {\n          font-family: var(--primary-font-family, Roboto);\n          fill: var(--primary-text-color, #000);\n        }\n        .power-value {\n          font-size: 10px;\n          font-weight: bold;\n        }\n        .label {\n          font-size: 10px;\n          opacity: 0.8;\n        }\n      </style>\n      <svg width="${t}" height="${e}" viewBox="0 0 ${t} ${e}"></svg>\n    `;const n=this.shadowRoot.querySelector("svg");if(!n)return;const s=t/2,r=e/2;n.appendChild(this.createIcon("home",s,r,0,"Home")),this.config.sources.forEach((o=>{const i=o.x/100*t,a=o.y/100*e;n.appendChild(this.createIcon(o.type,i,a,o.power,o.name)),n.appendChild(this.createFlowLine(i,a,s,r,o.power))})),this.config.consumers.forEach((o=>{const i=o.x/100*t,a=o.y/100*e;n.appendChild(this.createIcon("consumer",i,a,o.power,o.name)),n.appendChild(this.createFlowLine(s,r,i,a,o.power))}))}}customElements.define("ha-power-flow-card",e)})();