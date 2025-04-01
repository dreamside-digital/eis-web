import { useTranslations } from 'next-intl';
import MapPointSelector from '@/components/MapPointSelector';
import { useState } from 'react';

export default function Stage1({ profile, updateProfileData, setLocation, location }) {
  const t = useTranslations('profile_form');
  const [showPostalCodeField, setShowPostalCodeField] = useState(false)

  const revealPostalCodeField = (e) => {
    e.preventDefault()
    setShowPostalCodeField(true)
  }
  
  return (
    <div className="space-y-8">
        <div>
        <label className="font-semibold mb-1 block">{t('public_name')}</label>
        <input 
            required 
            onChange={updateProfileData("public_name")} 
            value={profile.public_name} 
            className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder={t('public_name_hint')}
        />
        </div>

        <div>
        <label className="font-semibold mb-1 block">{t('pronouns')}</label>
        <input 
            onChange={updateProfileData("pronouns")} 
            value={profile.pronouns} 
            className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder={t('pronouns_hint')}
        />
        </div>

        <div>
        <label className="font-semibold mb-1 block">{t('location')}</label>
        <small className="mb-2 block">{t('location_hint')}</small>
        <button hidden={showPostalCodeField} className="text-sm underline mb-4" onClick={revealPostalCodeField}>
            {t('refuse_location')}
        </button>
        {showPostalCodeField ? (
            <div>
            <label className="font-semibold mb-1 block">{t('postal_code')}</label>
            <input 
                onChange={updateProfileData("postal_code")} 
                value={profile.postal_code} 
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
            </div>
        ) : (
            <MapPointSelector setLocation={setLocation} selectedLocation={location} />
        )}
        </div>
    </div>
  )
}