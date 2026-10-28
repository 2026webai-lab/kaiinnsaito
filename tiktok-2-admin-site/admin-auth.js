// 管理者の2段階認証（TOTP）。DB側も、2段階認証済み（aal2）でないと管理者として扱いません（sql/setup3.sql）。
async function mfaOk(box){
  const M=sb.auth.mfa;
  const {data:a}=await M.getAuthenticatorAssuranceLevel();
  if(a&&a.currentLevel==='aal2'){box.hidden=true;return true}
  const {data:f}=await M.listFactors();
  const t=f&&f.totp&&f.totp[0];
  let fid,secret=null,html;
  if(t){fid=t.id;html='<p>認証アプリの6桁コードを入力してください。</p>'}
  else{
    for(const x of (f&&f.all)||[])if(x.status==='unverified')await M.unenroll({factorId:x.id});
    const {data:e,error}=await M.enroll({factorType:'totp',friendlyName:'wing-'+Date.now()});
    if(error){box.hidden=false;box.textContent='2段階認証を開始できませんでした。';return false}
    fid=e.id;secret=e.totp.secret;
    html='<p>はじめに、認証アプリ（Google Authenticator など）でQRコードを読み取ってください。</p><img src="'+e.totp.qr_code+'" alt="" style="width:180px;max-width:100%"><p class="mut" id="mfs"></p>';
  }
  box.innerHTML=html+'<label>6桁のコード<input id="mfc" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></label><button id="mfb" class="btn" style="margin-top:12px">確認する</button><p id="mfm" class="err"></p>';
  box.hidden=false;
  if(secret)box.querySelector('#mfs').textContent='読み取れない場合のキー：'+secret;
  box.querySelector('#mfb').onclick=async()=>{
    const c=await M.challenge({factorId:fid});
    const v=c.error?c:await M.verify({factorId:fid,challengeId:c.data.id,code:box.querySelector('#mfc').value.trim()});
    if(v.error)box.querySelector('#mfm').textContent='コードが違います。';else location.reload();
  };
  return false;
}
