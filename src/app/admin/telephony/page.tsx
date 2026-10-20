'use client';

import React, { useState } from 'react';
import { Radio, Shield, Send, CheckCircle, AlertTriangle, Key, Terminal, RefreshCw, Zap } from 'lucide-react';

export default function AdminTelephonyPage() {
  const [provider, setProvider] = useState<'mock_sandbox' | 'exotel' | 'twilio'>('mock_sandbox');
  const [webhookSecret, setWebhookSecret] = useState('ks_webhook_secret_demo_2026');
  const [callerPhone, setCallerPhone] = useState('+919443718847');
  const [callDuration, setCallDuration] = useState('145');

  // Simulator results
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<any[]>([]);
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const runSimulation = async (scenario: 'connected' | 'missed_call' | 'busy' | 'duplicate' | 'forged_signature') => {
    setIsSimulating(true);

    try {
      const payload: any = {
        scenario: scenario === 'duplicate' ? 'connected' : scenario === 'forged_signature' ? 'connected' : scenario,
        fromPhone: callerPhone,
        duration: scenario === 'missed_call' ? 0 : parseInt(callDuration, 10),
        tamperSignature: scenario === 'forged_signature',
        duplicateEventId: scenario === 'duplicate' ? lastEventId : undefined,
      };

      const res = await fetch('/api/telephony/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLastEventId(data.eventId);

      setSimResults((prev) => [
        {
          scenario,
          timestamp: new Date().toLocaleTimeString(),
          response: data,
          success: data.success,
        },
        ...prev,
      ]);
    } catch (err: unknown) {
      alert('Simulation error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Cloud Telephony Integration & Webhook Simulator
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Configure provider adapters (Exotel, Twilio, Knowlarity) and test webhook idempotency in the sandbox.
          </p>
        </div>
      </div>

      {/* Honest Technical Limitation Architecture Alert */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderLeft: '4px solid #2563eb',
          borderRadius: 'var(--radius-sm)',
          padding: '20px 24px',
          marginBottom: '28px',
          color: '#1e3a8a',
          fontSize: '0.9rem',
          lineHeight: '1.6',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} /> Honest Technical Capabilities & Architecture
        </h3>
        <p>
          Standard web browsers cannot silently inspect native phone calls on a parent&apos;s or staff member&apos;s mobile device. When a visitor taps &ldquo;Call the Centre&rdquo;, the native dialler is launched and a <em>Click Intent Event</em> is recorded. Automatic call confirmation (with verified duration and missed call status) is achieved strictly via authorized cloud telephony webhooks (such as Exotel or Twilio virtual numbers).
        </p>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Left: Configuration Details */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '16px' }}>
            Provider Webhook Endpoint
          </h2>

          <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--ivory-muted)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark-muted)', textTransform: 'uppercase' }}>
              Your Webhook Receiver URL (POST)
            </div>
            <code style={{ fontSize: '0.85rem', color: 'var(--navy-primary)', fontWeight: 600, wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>
              https://kalaivanisainikcoachingcentre.org.in/api/telephony/webhook
            </code>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tp_prov">Telephony Provider</label>
            <select
              id="tp_prov"
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="form-select"
            >
              <option value="mock_sandbox">Mock Telephony Sandbox (Recommended for Testing)</option>
              <option value="exotel">Exotel Cloud Telephony (India)</option>
              <option value="twilio">Twilio Voice Webhook</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tp_sec">
              Webhook HMAC Secret Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="tp_sec"
                type="text"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              />
              <Key size={16} style={{ position: 'absolute', right: '14px', top: '15px', color: 'var(--text-dark-muted)' }} />
            </div>
            <p className="form-hint">Used to verify x-telephony-signature on incoming webhook payloads</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tp_num">Official Virtual Inbound Number</label>
            <input
              id="tp_num"
              type="text"
              readOnly
              value="+91 94437 18847"
              className="form-input"
              style={{ backgroundColor: '#f8fafc' }}
            />
          </div>
        </div>

        {/* Right: Interactive Sandbox Simulator */}
        <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--gold-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Terminal size={20} style={{ color: 'var(--navy-primary)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Interactive Webhook Simulator
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '20px' }}>
            Trigger real telephony webhook events to test the CRM pipeline without incurring live telecom charges.
          </p>

          <div className="grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
            <div>
              <label className="form-label" htmlFor="sim_from" style={{ fontSize: '0.8rem' }}>Simulated Caller Phone</label>
              <input
                id="sim_from"
                type="text"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                className="form-input"
                style={{ height: '38px', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="sim_dur" style={{ fontSize: '0.8rem' }}>Call Duration (s)</label>
              <input
                id="sim_dur"
                type="number"
                value={callDuration}
                onChange={(e) => setCallDuration(e.target.value)}
                className="form-input"
                style={{ height: '38px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => runSimulation('connected')}
              disabled={isSimulating}
              className="btn btn-sm btn-primary"
              style={{ justifyContent: 'center' }}
            >
              1. Test Connected Call
            </button>

            <button
              onClick={() => runSimulation('missed_call')}
              disabled={isSimulating}
              className="btn btn-sm"
              style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', justifyContent: 'center' }}
            >
              2. Test Missed Call
            </button>

            <button
              onClick={() => runSimulation('duplicate')}
              disabled={isSimulating || !lastEventId}
              className="btn btn-sm"
              style={{ backgroundColor: '#f1f5f9', border: '1px solid var(--ivory-muted)', color: 'var(--text-dark)', justifyContent: 'center' }}
              title={!lastEventId ? 'Run test 1 first' : 'Resend same eventId to verify idempotency'}
            >
              3. Test Duplicate Event
            </button>

            <button
              onClick={() => runSimulation('forged_signature')}
              disabled={isSimulating}
              className="btn btn-sm"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', justifyContent: 'center' }}
            >
              4. Test Forged Signature
            </button>
          </div>

          {/* Simulation Output Log */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Live Simulation Output
            </div>
            <div
              style={{
                backgroundColor: '#070e1b',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                minHeight: '140px',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {simResults.length === 0 ? (
                <div style={{ color: '#64748b' }}>// Ready. Click any test scenario button above to fire webhook...</div>
              ) : (
                simResults.map((res, i) => (
                  <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <div style={{ color: '#fbbf24' }}>
                      [{res.timestamp}] Scenario: <strong>{res.scenario}</strong> (HTTP {res.response?.httpStatus})
                    </div>
                    <div>Status: {res.response?.webhookResponse?.message || 'Processed'}</div>
                    {res.response?.webhookResponse?.duplicate && (
                      <div style={{ color: '#60a5fa' }}>↳ IDEMPOTENCY KEY MATCHED: Duplicate delivery safely handled without double counting!</div>
                    )}
                    {res.response?.signatureTampered && (
                      <div style={{ color: '#f87171' }}>↳ SECURITY ENFORCED: Forged HMAC signature rejected (HTTP 403)!</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
