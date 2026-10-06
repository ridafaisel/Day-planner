type Slot = {start:number;count:number;task:string};
const time=(m:number)=>{const h=Math.floor(m/60);return `${h%12||12}:${String(m%60).padStart(2,'0')} ${h<12?'AM':'PM'}`};
// A single raster page preserves browser font support without PDF dependencies.
export function downloadPdf(date:string,slots:Slot[]){
 const canvas=document.createElement('canvas');canvas.width=1654;canvas.height=2339;
 const c=canvas.getContext('2d');if(!c)throw new Error('Canvas unavailable');
 c.scale(2,2);c.fillStyle='#fff';c.fillRect(0,0,827,1170);
 const text=(s:string,x:number,y:number,size=12,bold=false)=>{c.fillStyle='#171717';c.font=`${bold?'600':'400'} ${size}px Arial`;c.fillText(s,x,y)};
 const line=(x:number,y:number,x2:number,y2:number)=>{c.strokeStyle='#aaa';c.lineWidth=.65;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()};
 text('DAY PLANNER',48,58,11,true);text('Daily checklist',48,101,32,true);
 const d=new Date(`${date}T12:00:00`);text(d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}),48,130,14);
 text('6:00 AM — 10:00 PM  /  50 minutes focus + 10 minutes break every hour',48,160,11);
 const xs=[48,218,535,587,779],top=190,head=32,bottom=910,row=(bottom-top-head)/slots.length;
 c.fillStyle='#f0f0f0';c.fillRect(48,top,731,head);
 ['TIME','TASK','CHECK','NOTES'].forEach((s,i)=>text(s,xs[i]+9,top+21,10,true));
 for(const x of xs)line(x,top,x,bottom);line(48,top,779,top);line(48,top+head,779,top+head);
 slots.forEach((s,i)=>{const y=top+head+i*row;
 text(`${time(360+s.start*60)} — ${time(360+(s.start+s.count-1)*60+50)}`,57,y+20,10,true);
 if(s.count>1)text(`${s.count} blocks · hourly breaks`,57,y+35,9);
 let font=12,lines:string[]=[];
 const wrap=()=>{c.font=`${font}px Arial`;lines=[];let current='';for(const ch of Array.from(s.task)){if(ch==='\n'){lines.push(current);current='';continue}if(c.measureText(current+ch).width>297){lines.push(current);current=ch}else current+=ch}if(current)lines.push(current)};
 wrap();while(lines.length*(font+3)>row-12&&font>6){font--;wrap()}
 lines.forEach((s,j)=>text(s,228,y+17+j*(font+3),font));
 line(48,y+row,779,y+row);
 });
 text('DAILY NOTES',48,945,11,true);c.strokeStyle='#aaa';c.lineWidth=.65;c.strokeRect(48,961,731,145);
 for(let y=996;y<1106;y+=28)line(60,y,767,y);
 text('Take a 10-minute break at :50 each hour, including within merged tasks.',48,1131,10);
 const jpg=Uint8Array.from(atob(canvas.toDataURL('image/jpeg',.98).split(',')[1]),s=>s.charCodeAt(0));
 const enc=new TextEncoder();const parts:Uint8Array[]=[];let length=0;const offsets=[0];
 const add=(s:string|Uint8Array)=>{const b=typeof s==='string'?enc.encode(s):s;parts.push(b);length+=b.length};
 add('%PDF-1.4\n');
 const obj=(n:number,s:string)=>{offsets[n]=length;add(`${n} 0 obj\n${s}\nendobj\n`)};
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
 offsets[4]=length;add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width 1654 /Height 2339 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);add(jpg);add('\nendstream\nendobj\n');
 const stream='q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';obj(5,`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}endstream`);
 const xref=length;add('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)add(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
 const bytes=new Uint8Array(length);let p=0;for(const b of parts){bytes.set(b,p);p+=b.length}
 const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download=`day-planner-${date}.pdf`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
