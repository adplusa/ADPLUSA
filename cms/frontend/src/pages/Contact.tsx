import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getContact } from '../services/content.service';
import type { Contact as ContactType } from '../services/content.service';
import { Edit, Phone, Mail, MapPin, ExternalLink, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe, MessageCircle, Send, Loader2 } from 'lucide-react';

const getPlatformConfig = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return { icon: Facebook, color: 'bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-transparent' };
    case 'twitter': return { icon: Twitter, color: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-transparent' };
    case 'instagram': return { icon: Instagram, color: 'bg-[#E4405F] hover:bg-[#E4405F]/90 text-white border-transparent' };
    case 'linkedin': return { icon: Linkedin, color: 'bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white border-transparent' };
    case 'youtube': return { icon: Youtube, color: 'bg-[#FF0000] hover:bg-[#FF0000]/90 text-white border-transparent' };
    case 'github': return { icon: Github, color: 'bg-[#181717] hover:bg-[#181717]/90 text-white border-transparent' };
    case 'whatsapp': return { icon: MessageCircle, color: 'bg-[#25D366] hover:bg-[#25D366]/90 text-white border-transparent' };
    case 'telegram': return { icon: Send, color: 'bg-[#0088cc] hover:bg-[#0088cc]/90 text-white border-transparent' };
    case 'website': return { icon: Globe, color: 'bg-slate-800 hover:bg-slate-900 text-white border-transparent' };
    default: return { icon: ExternalLink, color: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border' };
  }
};

export default function Contact() {
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    countryCode: 'US',
    phone: '',
    email: '',
    message: ''
  });
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);
  const isFormValid = isEmailValid && formData.message.trim().length > 0;

  const countryCodes = [
    { code: 'US', dial_code: '+1', flag: '🇺🇸' },
    { code: 'GB', dial_code: '+44', flag: '🇬🇧' },
    { code: 'IN', dial_code: '+91', flag: '🇮🇳' },
    { code: 'CA', dial_code: '+1', flag: '🇨🇦' },
    { code: 'AU', dial_code: '+61', flag: '🇦🇺' },
    { code: 'AE', dial_code: '+971', flag: '🇦🇪' },
    { code: 'AF', dial_code: '+93', flag: '🇦🇫' },
    { code: 'AG', dial_code: '+1-268', flag: '🇦🇬' },
    { code: 'AI', dial_code: '+1-264', flag: '🇦🇮' },
    { code: 'AL', dial_code: '+355', flag: '🇦🇱' },
    { code: 'AM', dial_code: '+374', flag: '🇦🇲' },
    { code: 'AO', dial_code: '+244', flag: '🇦🇴' },
    { code: 'AR', dial_code: '+54', flag: '🇦🇷' },
    { code: 'AS', dial_code: '+1-684', flag: '🇦🇸' },
    { code: 'AT', dial_code: '+43', flag: '🇦🇹' },
    { code: 'AW', dial_code: '+297', flag: '🇦🇼' },
    { code: 'AZ', dial_code: '+994', flag: '🇦🇿' },
    { code: 'BA', dial_code: '+387', flag: '🇧🇦' },
    { code: 'BB', dial_code: '+1-246', flag: '🇧🇧' },
    { code: 'BD', dial_code: '+880', flag: '🇧🇩' },
    { code: 'BE', dial_code: '+32', flag: '🇧🇪' },
    { code: 'BF', dial_code: '+226', flag: '🇧🇫' },
    { code: 'BG', dial_code: '+359', flag: '🇧🇬' },
    { code: 'BH', dial_code: '+973', flag: '🇧🇭' },
    { code: 'BI', dial_code: '+257', flag: '🇧🇮' },
    { code: 'BJ', dial_code: '+229', flag: '🇧🇯' },
    { code: 'BL', dial_code: '+590', flag: '🇧🇱' },
    { code: 'BM', dial_code: '+1-441', flag: '🇧🇲' },
    { code: 'BN', dial_code: '+673', flag: '🇧🇳' },
    { code: 'BO', dial_code: '+591', flag: '🇧🇴' },
    { code: 'BR', dial_code: '+55', flag: '🇧🇷' },
    { code: 'BS', dial_code: '+1-242', flag: '🇧🇸' },
    { code: 'BT', dial_code: '+975', flag: '🇧🇹' },
    { code: 'BW', dial_code: '+267', flag: '🇧🇼' },
    { code: 'BY', dial_code: '+375', flag: '🇧🇾' },
    { code: 'BZ', dial_code: '+501', flag: '🇧🇿' },
    { code: 'CD', dial_code: '+243', flag: '🇨🇩' },
    { code: 'CF', dial_code: '+236', flag: '🇨🇫' },
    { code: 'CG', dial_code: '+242', flag: '🇨🇬' },
    { code: 'CH', dial_code: '+41', flag: '🇨🇭' },
    { code: 'CI', dial_code: '+225', flag: '🇨🇮' },
    { code: 'CK', dial_code: '+682', flag: '🇨🇰' },
    { code: 'CL', dial_code: '+56', flag: '🇨🇱' },
    { code: 'CM', dial_code: '+237', flag: '🇨🇲' },
    { code: 'CN', dial_code: '+86', flag: '🇨🇳' },
    { code: 'CO', dial_code: '+57', flag: '🇨🇴' },
    { code: 'CR', dial_code: '+506', flag: '🇨🇷' },
    { code: 'CU', dial_code: '+53', flag: '🇨🇺' },
    { code: 'CV', dial_code: '+238', flag: '🇨🇻' },
    { code: 'CW', dial_code: '+599', flag: '🇨🇼' },
    { code: 'CY', dial_code: '+357', flag: '🇨🇾' },
    { code: 'CZ', dial_code: '+420', flag: '🇨🇿' },
    { code: 'DE', dial_code: '+49', flag: '🇩🇪' },
    { code: 'DJ', dial_code: '+253', flag: '🇩🇯' },
    { code: 'DK', dial_code: '+45', flag: '🇩🇰' },
    { code: 'DM', dial_code: '+1-767', flag: '🇩🇲' },
    { code: 'DO', dial_code: '+1-809', flag: '🇩🇴' },
    { code: 'DZ', dial_code: '+213', flag: '🇩🇿' },
    { code: 'EC', dial_code: '+593', flag: '🇪🇨' },
    { code: 'EE', dial_code: '+372', flag: '🇪🇪' },
    { code: 'EG', dial_code: '+20', flag: '🇪🇬' },
    { code: 'EH', dial_code: '+212', flag: '🇪🇭' },
    { code: 'ER', dial_code: '+291', flag: '🇪🇷' },
    { code: 'ES', dial_code: '+34', flag: '🇪🇸' },
    { code: 'ET', dial_code: '+251', flag: '🇪🇹' },
    { code: 'FI', dial_code: '+358', flag: '🇫🇮' },
    { code: 'FJ', dial_code: '+679', flag: '🇫🇯' },
    { code: 'FK', dial_code: '+500', flag: '🇫🇰' },
    { code: 'FM', dial_code: '+691', flag: '🇫🇲' },
    { code: 'FO', dial_code: '+500', flag: '🇫🇴' },
    { code: 'FR', dial_code: '+33', flag: '🇫🇷' },
    { code: 'GA', dial_code: '+241', flag: '🇬🇦' },
    { code: 'GD', dial_code: '+1-473', flag: '🇬🇩' },
    { code: 'GE', dial_code: '+995', flag: '🇬🇪' },
    { code: 'GF', dial_code: '+500', flag: '🇬🇫' },
    { code: 'GG', dial_code: '+44', flag: '🇬🇬' },
    { code: 'GH', dial_code: '+233', flag: '🇬🇭' },
    { code: 'GI', dial_code: '+350', flag: '🇬🇮' },
    { code: 'GL', dial_code: '+299', flag: '🇬🇱' },
    { code: 'GM', dial_code: '+220', flag: '🇬🇲' },
    { code: 'GN', dial_code: '+224', flag: '🇬🇳' },
    { code: 'GP', dial_code: '+590', flag: '🇬🇵' },
    { code: 'GQ', dial_code: '+240', flag: '🇬🇶' },
    { code: 'GR', dial_code: '+30', flag: '🇬🇷' },
    { code: 'GT', dial_code: '+502', flag: '🇬🇹' },
    { code: 'GU', dial_code: '+1-671', flag: '🇬🇺' },
    { code: 'GW', dial_code: '+245', flag: '🇬🇼' },
    { code: 'GY', dial_code: '+592', flag: '🇬🇾' },
    { code: 'HK', dial_code: '+852', flag: '🇭🇰' },
    { code: 'HN', dial_code: '+504', flag: '🇭🇳' },
    { code: 'HR', dial_code: '+385', flag: '🇭🇷' },
    { code: 'HT', dial_code: '+509', flag: '🇭🇹' },
    { code: 'HU', dial_code: '+36', flag: '🇭🇺' },
    { code: 'ID', dial_code: '+62', flag: '🇮🇩' },
    { code: 'IE', dial_code: '+353', flag: '🇮🇪' },
    { code: 'IL', dial_code: '+972', flag: '🇮🇱' },
    { code: 'IM', dial_code: '+44', flag: '🇮🇲' },
    { code: 'IQ', dial_code: '+964', flag: '🇮🇶' },
    { code: 'IR', dial_code: '+98', flag: '🇮🇷' },
    { code: 'IS', dial_code: '+354', flag: '🇮🇸' },
    { code: 'IT', dial_code: '+39', flag: '🇮🇹' },
    { code: 'JE', dial_code: '+44', flag: '🇯🇪' },
    { code: 'JM', dial_code: '+1-876', flag: '🇯🇲' },
    { code: 'JO', dial_code: '+962', flag: '🇯🇴' },
    { code: 'JP', dial_code: '+81', flag: '🇯🇵' },
    { code: 'KE', dial_code: '+254', flag: '🇰🇪' },
    { code: 'KG', dial_code: '+996', flag: '🇰🇬' },
    { code: 'KH', dial_code: '+855', flag: '🇰🇭' },
    { code: 'KI', dial_code: '+686', flag: '🇰🇮' },
    { code: 'KM', dial_code: '+269', flag: '🇰🇲' },
    { code: 'KN', dial_code: '+1-869', flag: '🇰🇳' },
    { code: 'KP', dial_code: '+850', flag: '🇰🇵' },
    { code: 'KR', dial_code: '+82', flag: '🇰🇷' },
    { code: 'KW', dial_code: '+965', flag: '🇰🇼' },
    { code: 'KY', dial_code: '+1-345', flag: '🇰🇾' },
    { code: 'KZ', dial_code: '+7', flag: '🇰🇿' },
    { code: 'LA', dial_code: '+856', flag: '🇱🇦' },
    { code: 'LB', dial_code: '+961', flag: '🇱🇧' },
    { code: 'LC', dial_code: '+1-758', flag: '🇱🇨' },
    { code: 'LI', dial_code: '+423', flag: '🇱🇮' },
    { code: 'LK', dial_code: '+94', flag: '🇱🇰' },
    { code: 'LR', dial_code: '+231', flag: '🇱🇷' },
    { code: 'LS', dial_code: '+266', flag: '🇱🇸' },
    { code: 'LT', dial_code: '+370', flag: '🇱🇹' },
    { code: 'LU', dial_code: '+370', flag: '🇱🇺' },
    { code: 'LV', dial_code: '+371', flag: '🇱🇻' },
    { code: 'LY', dial_code: '+218', flag: '🇱🇾' },
    { code: 'MA', dial_code: '+212', flag: '🇲🇦' },
    { code: 'MC', dial_code: '+377', flag: '🇲🇨' },
    { code: 'MD', dial_code: '+373', flag: '🇲🇩' },
    { code: 'ME', dial_code: '+382', flag: '🇲🇪' },
    { code: 'MF', dial_code: '+590', flag: '🇲🇫' },
    { code: 'MG', dial_code: '+261', flag: '🇲🇬' },
    { code: 'MH', dial_code: '+692', flag: '🇲🇭' },
    { code: 'MK', dial_code: '+389', flag: '🇲🇰' },
    { code: 'ML', dial_code: '+223', flag: '🇲🇱' },
    { code: 'MM', dial_code: '+95', flag: '🇲🇲' },
    { code: 'MN', dial_code: '+976', flag: '🇲🇳' },
    { code: 'MO', dial_code: '+853', flag: '🇲🇴' },
    { code: 'MP', dial_code: '+1-670', flag: '🇲🇵' },
    { code: 'MQ', dial_code: '+596', flag: '🇲🇶' },
    { code: 'MR', dial_code: '+222', flag: '🇲🇷' },
    { code: 'MS', dial_code: '+1-664', flag: '🇲🇸' },
    { code: 'MT', dial_code: '+356', flag: '🇲🇹' },
    { code: 'MU', dial_code: '+230', flag: '🇲🇺' },
    { code: 'MV', dial_code: '+960', flag: '🇲🇻' },
    { code: 'MW', dial_code: '+265', flag: '🇲🇼' },
    { code: 'MX', dial_code: '+52', flag: '🇲🇽' },
    { code: 'MY', dial_code: '+60', flag: '🇲🇾' },
    { code: 'MZ', dial_code: '+258', flag: '🇲🇿' },
    { code: 'NA', dial_code: '+264', flag: '🇳🇦' },
    { code: 'NC', dial_code: '+687', flag: '🇳🇨' },
    { code: 'NE', dial_code: '+227', flag: '🇳🇪' },
    { code: 'NF', dial_code: '+672', flag: '🇳🇫' },
    { code: 'NG', dial_code: '+234', flag: '🇳🇬' },
    { code: 'NI', dial_code: '+227', flag: '🇳🇮' },
    { code: 'NL', dial_code: '+31', flag: '🇳🇱' },
    { code: 'NO', dial_code: '+47', flag: '🇳🇴' },
    { code: 'NP', dial_code: '+977', flag: '🇳🇵' },
    { code: 'NR', dial_code: '+674', flag: '🇳🇷' },
    { code: 'NU', dial_code: '+683', flag: '🇳🇺' },
    { code: 'NZ', dial_code: '+64', flag: '🇳🇿' },
    { code: 'OM', dial_code: '+968', flag: '🇴🇲' },
    { code: 'PA', dial_code: '+507', flag: '🇵🇦' },
    { code: 'PE', dial_code: '+51', flag: '🇵🇪' },
    { code: 'PF', dial_code: '+594', flag: '🇵🇫' },
    { code: 'PG', dial_code: '+675', flag: '🇵🇬' },
    { code: 'PH', dial_code: '+63', flag: '🇵🇭' },
    { code: 'PK', dial_code: '+92', flag: '🇵🇰' },
    { code: 'PL', dial_code: '+48', flag: '🇵🇱' },
    { code: 'PM', dial_code: '+508', flag: '🇵🇲' },
    { code: 'PN', dial_code: '+870', flag: '🇵🇳' },
    { code: 'PR', dial_code: '+1', flag: '🇵🇷' },
    { code: 'PS', dial_code: '+970', flag: '🇵🇸' },
    { code: 'PT', dial_code: '+351', flag: '🇵🇹' },
    { code: 'PW', dial_code: '+680', flag: '🇵🇼' },
    { code: 'PY', dial_code: '+595', flag: '🇵🇾' },
    { code: 'QA', dial_code: '+974', flag: '🇶🇦' },
    { code: 'RO', dial_code: '+40', flag: '🇷🇴' },
    { code: 'RS', dial_code: '+381', flag: '🇷🇸' },
    { code: 'RU', dial_code: '+7', flag: '🇷🇺' },
    { code: 'RW', dial_code: '+250', flag: '🇷🇼' },
    { code: 'SA', dial_code: '+966', flag: '🇸🇦' },
    { code: 'SB', dial_code: '+677', flag: '🇸🇧' },
    { code: 'SC', dial_code: '+248', flag: '🇸🇨' },
    { code: 'SD', dial_code: '+249', flag: '🇸🇩' },
    { code: 'SE', dial_code: '+46', flag: '🇸🇪' },
    { code: 'SG', dial_code: '+65', flag: '🇸🇬' },
    { code: 'SH', dial_code: '+290', flag: '🇸🇭' },
    { code: 'SI', dial_code: '+386', flag: '🇸🇮' },
    { code: 'SJ', dial_code: '+47', flag: '🇸🇯' },
    { code: 'SK', dial_code: '+421', flag: '🇸🇰' },
    { code: 'SL', dial_code: '+232', flag: '🇸🇱' },
    { code: 'SM', dial_code: '+378', flag: '🇸🇲' },
    { code: 'SN', dial_code: '+221', flag: '🇸🇳' },
    { code: 'SO', dial_code: '+252', flag: '🇸🇴' },
    { code: 'SR', dial_code: '+597', flag: '🇸🇷' },
    { code: 'SS', dial_code: '+211', flag: '🇸🇸' },
    { code: 'ST', dial_code: '+239', flag: '🇸🇹' },
    { code: 'SV', dial_code: '+503', flag: '🇸🇻' },
    { code: 'SX', dial_code: '+1-721', flag: '🇸🇽' },
    { code: 'SY', dial_code: '+963', flag: '🇸🇾' },
    { code: 'SZ', dial_code: '+268', flag: '🇸🇿' },
    { code: 'TC', dial_code: '+1-649', flag: '🇹🇨' },
    { code: 'TD', dial_code: '+235', flag: '🇹🇩' },
    { code: 'TG', dial_code: '+228', flag: '🇹🇬' },
    { code: 'TH', dial_code: '+66', flag: '🇹🇭' },
    { code: 'TJ', dial_code: '+992', flag: '🇹🇯' },
    { code: 'TK', dial_code: '+690', flag: '🇹🇰' },
    { code: 'TL', dial_code: '+670', flag: '🇹🇱' },
    { code: 'TM', dial_code: '+993', flag: '🇹🇲' },
    { code: 'TN', dial_code: '+216', flag: '🇹🇳' },
    { code: 'TO', dial_code: '+676', flag: '🇹🇴' },
    { code: 'TR', dial_code: '+90', flag: '🇹🇷' },
    { code: 'TT', dial_code: '+1-868', flag: '🇹🇹' },
    { code: 'TV', dial_code: '+688', flag: '🇹🇻' },
    { code: 'TW', dial_code: '+886', flag: '🇹🇼' },
    { code: 'TZ', dial_code: '+255', flag: '🇹🇿' },
    { code: 'UA', dial_code: '+380', flag: '🇺🇦' },
    { code: 'UG', dial_code: '+256', flag: '🇺🇬' },
    { code: 'UY', dial_code: '+595', flag: '🇺🇾' },
    { code: 'UZ', dial_code: '+998', flag: '🇺🇿' },
    { code: 'VA', dial_code: '+379', flag: '🇻🇦' },
    { code: 'VC', dial_code: '+1-784', flag: '🇻🇨' },
    { code: 'VE', dial_code: '+58', flag: '🇻🇪' },
    { code: 'VG', dial_code: '+1-284', flag: '🇻🇬' },
    { code: 'VI', dial_code: '+1-340', flag: '🇻🇮' },
    { code: 'VN', dial_code: '+84', flag: '🇻🇳' },
    { code: 'VU', dial_code: '+678', flag: '🇻🇺' },
    { code: 'WF', dial_code: '+681', flag: '🇼🇫' },
    { code: 'WS', dial_code: '+685', flag: '🇼🇸' },
    { code: 'YE', dial_code: '+967', flag: '🇾🇪' },
    { code: 'YT', dial_code: '+262', flag: '🇾🇹' },
    { code: 'ZA', dial_code: '+27', flag: '🇿🇦' },
    { code: 'ZM', dial_code: '+260', flag: '🇿🇲' },
    { code: 'ZW', dial_code: '+263', flag: '🇿🇼' },
  ];

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getContact();
        setContact(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load contact page');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const handleSendMessage = async () => {
    // Basic validation to prevent empty sends
    if (!formData.email || !formData.message) {
        alert("Please provide at least an email and a message.");
        return;
    }

    setIsSending(true);
    try {
        const dialCode = countryCodes.find(c => c.code === formData.countryCode)?.dial_code || '';
        // Use environment variable for API URL, fallback to localhost for development
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000';
        // 2. This calls the backend route we just registered
        const response = await axios.post(`${apiUrl}/api/contact/sync`, {
            emailId: formData.email,
            htmlContent: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px;">
                    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e5e7eb;">
                        <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Website Inquiry</h2>
                        </div>
                        
                        <div style="padding: 32px;">
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Name</p>
                                <p style="margin: 0; color: #111827; font-size: 16px;">${formData.name}</p>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Email</p>
                                <p style="margin: 0; color: #111827; font-size: 16px;">
                                    <a href="mailto:${formData.email}" style="color: #4f46e5; text-decoration: none;">${formData.email}</a>
                                </p>
                            </div>

                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Phone</p>
                                <p style="margin: 0; color: #111827; font-size: 16px;">${dialCode} ${formData.phone}</p>
                            </div>

                            <div style="margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                                <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Message</p>
                                <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; color: #374151; line-height: 1.6; font-size: 16px;">
                                    ${formData.message.replace(/\n/g, '<br>')}
                                </div>
                            </div>

                            <div style="margin-top: 32px; text-align: center;">
                                <a href="mailto:${formData.email}?subject=Response%20to%20your%20inquiry" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Reply to Sender</a>
                            </div>
                        </div>

                        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                Received on ${new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        // Show exactly where the backend sent the email
        alert(response.data.message || "Success! Email sent.");
        
        // Optional: Clear the form after success
        setFormData({ name: '', phone: '', countryCode: 'US', email: '', message: '' });
    } catch (err: any) {
        alert("Failed to send message. Make sure the backend is running and your .env is correct.");
    } finally {
        setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Contact Page
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Contact Page
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Contact Page
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No contact page content found.</p>
            <Button onClick={() => navigate('/dashboard/contact/edit')}>
              Add Contact Information
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{contact.title}</h1>
        <Button onClick={() => navigate('/dashboard/contact/edit')} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Contact Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="space-y-4">
                {/* 1. NAME BOX */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    disabled={isSending}
                  />
                </div>

                {/* 2. PHONE BOX + COUNTRY PICKER */}
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-24 px-2 py-2 border border-gray-300 rounded-lg bg-white"
                      disabled={isSending}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.dial_code}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="Phone number"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      disabled={isSending}
                    />
                  </div>
                </div>

                {/* 3. EMAIL BOX */}
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value.replace(/\s/g, '') });
                      setEmailError('');
                    }}
                    onBlur={(e) => {
                      if (e.target.value && !emailRegex.test(e.target.value)) setEmailError('Invalid format');
                    }}
                    placeholder="email@domain.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isSending}
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>

                {/* 4. MESSAGE BOX */}
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    disabled={isSending}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSendMessage}
                  disabled={isSending || !isFormValid}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${contact.contactInfo.phone}`} className="text-sm text-blue-600 hover:underline">
                      {contact.contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${contact.contactInfo.email}`} className="text-sm text-blue-600 hover:underline">
                      {contact.contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.contactInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{contact.contactInfo.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Social Links */}
          {/* @ts-ignore - socialLinks might not be in the type definition yet */}
          {contact.socialLinks && contact.socialLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {/* @ts-ignore */}
                  {contact.socialLinks.map((link: any, index: number) => {
                    const { icon: Icon, color } = getPlatformConfig(link.platform);
                    return link.isActive && (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm border ${color}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="capitalize font-medium">{link.platform}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {contact.contactInfo.socialMedia && Object.values(contact.contactInfo.socialMedia).some(url => url) && (
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {contact.contactInfo.socialMedia.facebook && (
                    <a
                      href={contact.contactInfo.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Facebook
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.instagram && (
                    <a
                      href={contact.contactInfo.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm"
                    >
                      Instagram
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.linkedin && (
                    <a
                      href={contact.contactInfo.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm"
                    >
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.twitter && (
                    <a
                      href={contact.contactInfo.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-sm"
                    >
                      Twitter
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contact.contactInfo.socialMedia.youtube && (
                    <a
                      href={contact.contactInfo.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      YouTube
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {(contact.seoTitle || contact.seoDescription) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contact.seoTitle && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Title</label>
                <p className="text-sm">{contact.seoTitle}</p>
              </div>
            )}
            {contact.seoDescription && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">SEO Description</label>
                <p className="text-sm">{contact.seoDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-sm text-muted-foreground">
        Last updated: {new Date(contact.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}