import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  KeyRound, 
  AlertCircle, 
  X, 
  Camera
} from 'lucide-react';
import './ProfileSettings.css';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateRegistered: string;
  subscriptionTier: string;
  subscriptionBadge: string;
  avatarText: string;
  avatarColor: string;
  avatarImage?: string;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  firstName: 'Alia',
  lastName: 'Bhatt',
  email: 'alia.bhatt@rixly.app',
  dateRegistered: 'December 1, 2025',
  subscriptionTier: 'Premium Access (Whitelisted)',
  subscriptionBadge: 'Premium User (Whitelisted)',
  avatarText: 'AB',
  avatarColor: '#78350f',
  avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'
};

interface ProfileSettingsProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  isOpen = true,
  onClose 
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rixly_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USER_PROFILE;
  });

  const [initialProfile] = useState<UserProfile>(profile);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfile(prev => ({
            ...prev,
            avatarImage: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfile(prev => ({
      ...prev,
      avatarImage: undefined
    }));
  };

  useEffect(() => {
    // Keep avatar text synchronized with first & last name
    const fInitial = profile.firstName ? profile.firstName[0].toUpperCase() : '';
    const lInitial = profile.lastName ? profile.lastName[0].toUpperCase() : '';
    const avatar = `${fInitial}${lInitial}` || 'RL';
    if (avatar !== profile.avatarText) {
      setProfile(prev => ({ ...prev, avatarText: avatar }));
    }
  }, [profile.firstName, profile.lastName]);

  if (!isOpen) return null;

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('rixly_user_profile', JSON.stringify(profile));
    
    // Dispatch global event for header and dashboard updates
    window.dispatchEvent(new CustomEvent('rixly_profile_updated', { detail: profile }));

    // When user taps Save changes, pop-up goes off immediately
    onClose();
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    onClose();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setPasswordError('');
    setShowResetPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordToast(true);
    setTimeout(() => {
      setPasswordToast(false);
    }, 3000);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={handleOverlayClick}>
      <div className="profile-modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Toast for Password Reset */}
        {passwordToast && (
          <div className="profile-toast success">
            <Shield size={14} className="toast-icon" />
            <span>Password has been reset securely.</span>
          </div>
        )}

        {/* Unified Profile Settings Card */}
        <div className="profile-settings-card">
          
          {/* Modal Header inside Card */}
          <div className="profile-card-header-bar">
            <div className="profile-modal-titles">
              <h1 className="profile-page-title">Profile Settings</h1>
              <p className="profile-page-subtitle">Manage your profile information and security settings.</p>
            </div>
            <button 
              type="button" 
              className="profile-modal-close-btn" 
              onClick={handleCancel}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="profile-card-divider" style={{ margin: '16px 0 22px 0' }} />

          <form onSubmit={handleSaveChanges}>
            
            {/* Hidden File Input for Avatar DP Upload */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Top Row: Your Profile Avatar & Meta */}
            <div className="profile-card-top-section">
              <div 
                className="profile-avatar-large" 
                style={{ backgroundColor: profile.avatarColor }}
                onClick={handleAvatarClick}
                title="Click to upload profile photo (DP)"
              >
                {profile.avatarImage ? (
                  <img src={profile.avatarImage} alt="User DP" className="profile-avatar-img-circle" />
                ) : (
                  <span>{profile.avatarText}</span>
                )}
                <span className="profile-avatar-camera-pill">
                  <Camera size={11} />
                </span>
              </div>

              <div className="profile-avatar-meta">
                <h3 className="profile-section-heading">Your Profile</h3>
                <p className="profile-section-subtext">Update your photo and personal details.</p>
                <div className="profile-avatar-action-links">
                  <button 
                    type="button" 
                    className="avatar-link-btn" 
                    onClick={handleAvatarClick}
                  >
                    Upload photo
                  </button>
                  {profile.avatarImage && (
                    <>
                      <span className="link-divider">•</span>
                      <button 
                        type="button" 
                        className="avatar-link-btn danger" 
                        onClick={handleRemovePhoto}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-card-divider" />

            {/* Personal Details Form Section */}
            <div className="profile-form-section">
              
              {/* First Name & Last Name in 2 columns */}
              <div className="profile-form-row-2col">
                <div className="profile-input-group">
                  <label className="profile-field-label">First Name</label>
                  <input 
                    type="text" 
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="profile-field-input"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-field-label">Last Name</label>
                  <input 
                    type="text" 
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="profile-field-input"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="profile-input-group">
                <label className="profile-field-label">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="profile-field-input"
                  placeholder="name@company.com"
                  required
                />
              </div>

              {/* Date Registered (Read Only) */}
              <div className="profile-input-group">
                <label className="profile-field-label">Date Registered</label>
                <input 
                  type="text" 
                  value={profile.dateRegistered}
                  disabled
                  className="profile-field-input disabled"
                />
              </div>

            </div>

            <div className="profile-card-divider" />

            {/* Subscription Section */}
            <div className="profile-form-section">
              <h3 className="profile-section-heading">Subscription</h3>
              
              <div className="profile-subscription-row">
                <span className="profile-field-label" style={{ marginBottom: 6, display: 'block' }}>
                  Current Subscription Status
                </span>
                <div className="subscription-status-badge-row">
                  <span className="subscription-green-pill">
                    {profile.subscriptionBadge}
                  </span>
                  <span className="subscription-tier-text">
                    {profile.subscriptionTier}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-card-divider" />

            {/* Security Section (LinkedIn/Reddit connectors removed) */}
            <div className="profile-form-section">
              <h3 className="profile-section-heading">Security</h3>
              <p className="profile-section-subtext" style={{ marginBottom: 14 }}>
                Manage your password to keep your account secure.
              </p>

              <div>
                <button 
                  type="button" 
                  className="profile-reset-password-btn"
                  onClick={() => setShowResetPasswordModal(true)}
                >
                  Reset Password
                </button>
              </div>
            </div>

            {/* Card Action Buttons (Cancel & Save Changes) */}
            <div className="profile-card-bottom-actions">
              <button 
                type="button" 
                className="profile-btn-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="profile-btn-save"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Password Reset Sub-modal */}
      {showResetPasswordModal && (
        <div className="password-modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
          <div className="password-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <div className="password-modal-title-group">
                <KeyRound size={16} className="modal-title-icon" />
                <h3>Reset Your Password</h3>
              </div>
              <button 
                type="button"
                className="modal-close-btn" 
                onClick={() => setShowResetPasswordModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="password-modal-body">
                <p className="password-modal-desc">
                  Enter a new password for account <strong>{profile.email}</strong>.
                </p>

                {passwordError && (
                  <div className="password-error-banner">
                    <AlertCircle size={14} />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="profile-input-group" style={{ marginBottom: 14 }}>
                  <label className="profile-field-label">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="profile-field-input"
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-field-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="profile-field-input"
                    required
                  />
                </div>
              </div>

              <div className="password-modal-footer">
                <button 
                  type="button" 
                  className="profile-btn-cancel"
                  onClick={() => setShowResetPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="profile-btn-save"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
