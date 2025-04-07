"use client";
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
    <div className="space-y-6">
        <div>
            <div>
                <label className="font-semibold mb-1 block text-xl">{t('public_name')}</label>
                {t.has('public_name_hint') && <p className="mb-2 text-sm block">{t('public_name_hint')}</p>}
            </div>
            <div>
            <input 
                required 
                onChange={updateProfileData("public_name")} 
                value={profile.public_name} 
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-lavendar text-xl" 
            />
            </div>
        </div>

        <div>
            <div>
                <label className="font-semibold mb-1 block text-xl">{t('pronouns')}</label>
                {t.has('pronouns_hint') && <p className="mb-2 text-sm block">{t('pronouns_hint')}</p>}
            </div>
            <div>
                <input 
                    required 
                    onChange={updateProfileData("pronouns")} 
                    value={profile.pronouns} 
                    className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-lavendar text-xl" 
                />
            </div>
        </div>

        <div>
            <div>
                <label className="font-semibold mb-1 block text-xl">{t('profile_type')}</label>
                {t.has('profile_type_hint') && <p className="mb-2 text-sm block">{t('profile_type_hint')}</p>}
            </div>
            <div className="space-x-4">
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="profile_type"
                    value="individual"
                    checked={profile.profile_type === 'individual'}
                    onChange={updateProfileData("profile_type")}
                    className="form-radio text-lavendar focus:ring-2 focus:ring-lavendar text-xl"
                />
                <span className="ml-2">{t('individual')}</span>
            </label>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="profile_type"
                    value="collective"
                    checked={profile.profile_type === 'collective'}
                    onChange={updateProfileData("profile_type")}
                    className="form-radio text-lavendar focus:ring-2 focus:ring-lavendar text-xl"
                />
                <span className="ml-2">{t('collective')}</span>
            </label>
        </div>
        </div>

        <div>
        <label className="font-semibold mb-1 block text-xl">{t('location')}</label>
        {t.has('location_hint') && <p className="mb-2 text-sm block">{t('location_hint')}</p>}
        <button hidden={showPostalCodeField} className="text-sm underline mb-4" onClick={revealPostalCodeField}>
            {t('refuse_location')}
        </button>
        {showPostalCodeField ? (
            <div>
            <label className="font-semibold mb-1 block text-xl">{t('postal_code')}</label>
            <input 
                onChange={updateProfileData("postal_code")} 
                value={profile.postal_code} 
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-lavendar text-xl" 
            />
            </div>
        ) : (
            <MapPointSelector setLocation={setLocation} selectedLocation={location} />
        )}
        </div>
    </div>
  )
}