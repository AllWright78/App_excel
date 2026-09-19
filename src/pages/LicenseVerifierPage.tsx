import React, { useState } from 'react';
import { api } from '../services/api';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Code2,
  Copy,
  Check,
  Terminal,
  Cpu,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const LicenseVerifierPage: React.FC = () => {
  const { addToast } = useNotifications();

  const [licenseKey, setLicenseKey] = useState('EXCEL-STK-7789-2025');
  const [productId, setProductId] = useState('prod-1');
  const [machineId, setMachineId] = useState('PC-WIN11-0089A');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [copiedVba, setCopiedVba] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.verifyLicenseKey(licenseKey, productId);
    setVerificationResult(res);
    setLoading(false);

    if (res.valid) {
      addToast('Licence Validée !', res.message, 'success');
    } else {
      addToast('Licence Invalide', res.message, 'error');
    }
  };

  const vbaSnippet = `' =========================================================================
' MODULE VBA APP EXCEL : Module_LicenseActivation.bas
' À intégrer dans ThisWorkbook ou dans un module standard pour protéger
' automatiquement votre classeur Excel.
' =========================================================================

Option Explicit

Private Const API_URL As String = "https://appexcel.tg/api/licenses/verify"
Private Const APP_PRODUCT_ID As String = "prod-1"

Public Function VerifierLicenceExcel(ByVal strCleLicence As String) As Boolean
    Dim http As Object
    Dim jsonPayload As String
    Dim responseText As String
    Dim machineID As String
    
    On Error GoTo ErrorHandler
    
    ' Obtention de l'identifiant matériel unique de l'ordinateur
    machineID = Environ("COMPUTERNAME") & "_" & Environ("USERNAME")
    
    ' Préparation de la requête JSON
    jsonPayload = "{""license_key"":""" & strCleLicence & """," & _
                  """product_id"":""" & APP_PRODUCT_ID & """," & _
                  """machine_id"":""" & machineID & """}"
                  
    Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    http.Open "POST", API_URL, False
    http.setRequestHeader "Content-Type", "application/json"
    http.setRequestHeader "Accept", "application/json"
    http.send jsonPayload
    
    If http.Status = 200 Then
        responseText = http.responseText
        If InStr(1, responseText, """valid"":true", vbTextCompare) > 0 Then
            VerifierLicenceExcel = True
            Exit Function
        End If
    End If
    
    VerifierLicenceExcel = False
    Exit Function

ErrorHandler:
    VerifierLicenceExcel = False
End Function

Sub Workbook_Open()
    Dim cleEnregistree As String
    cleEnregistree = ThisWorkbook.Sheets("Config").Range("B2").Value
    
    If Not VerifierLicenceExcel(cleEnregistree) Then
        MsgBox "ERREUR DE LICENCE APP EXCEL :" & vbCrLf & _
               "Votre clé d'activation est invalide ou expirée." & vbCrLf & _
               "Veuillez vous rendre sur https://appexcel.tg pour renouveler.", _
               vbCritical, "Protection APP EXCEL"
        ThisWorkbook.Close SaveChanges:=False
    End If
End Sub`;

  const copyVba = () => {
    navigator.clipboard.writeText(vbaSnippet);
    setCopiedVba(true);
    addToast('Copié !', 'Code VBA d’activation copié dans le presse-papier.', 'info');
    setTimeout(() => setCopiedVba(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Architecture de Protection Logicielle (Section 36)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Vérificateur d’API & Système de Licences Excel
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Testez en temps réel les appels de validation de licences utilisés par les macros VBA des fichiers Excel et téléchargez le module d'intégration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Verification Simulation Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Simulateur d’appel d’activation</h3>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Clé de licence (license_key)
              </label>
              <input
                type="text"
                required
                value={licenseKey}
                onChange={e => setLicenseKey(e.target.value)}
                placeholder="EXCEL-XXX-XXXX-2025"
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
              />
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setLicenseKey('EXCEL-STK-7789-2025'); setProductId('prod-1'); }}
                  className="text-[10px] text-emerald-700 hover:underline font-semibold"
                >
                  Charger clé active (Stock Pro)
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => { setLicenseKey('EXCEL-CRM-9901-2024'); setProductId('prod-3'); }}
                  className="text-[10px] text-rose-600 hover:underline font-semibold"
                >
                  Charger clé expirée
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                ID du produit (product_id)
              </label>
              <input
                type="text"
                required
                value={productId}
                onChange={e => setProductId(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">
                Identifiant machine / PC (machine_id)
              </label>
              <input
                type="text"
                value={machineId}
                onChange={e => setMachineId(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>{loading ? 'Interrogation du serveur...' : 'Tester la validation API'}</span>
            </button>
          </form>

          {/* Verification Result Output */}
          {verificationResult && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              verificationResult.valid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {verificationResult.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <span>Statut : {verificationResult.valid ? 'LICENCE VALIDE' : 'LICENCE INVALIDE'}</span>
              </div>

              <p className="text-xs">{verificationResult.message}</p>

              {verificationResult.valid && (
                <div className="text-[11px] space-y-1 pt-2 border-t border-emerald-200">
                  <p>Date d'expiration : <strong>{verificationResult.expires_at}</strong></p>
                  <p>Jours restants : <strong>{verificationResult.remaining_days} jours</strong></p>
                  <p>Type : <strong className="capitalize">{verificationResult.type}</strong></p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: VBA Integration Code Snippet (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold">Module VBA d’activation (Module_LicenseActivation.bas)</h3>
            </div>
            <button
              onClick={copyVba}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg font-semibold border border-slate-700 transition-colors"
            >
              {copiedVba ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedVba ? 'Copié !' : 'Copier le code'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Intégrez ce module dans vos classeurs Excel <code>.xlsm</code> pour communiquer avec l'API APP EXCEL. À chaque ouverture du fichier, le script valide silencieusement l'état de la licence.
          </p>

          <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[380px] border border-slate-800 leading-relaxed">
            {vbaSnippet}
          </pre>
        </div>

      </div>

    </div>
  );
};
