import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe, MessageCircle, Send, ExternalLink } from 'lucide-react';

export interface SocialLink {
    platform: string;
    url: string;
    isActive: boolean;
}

interface SocialLinksEditorProps {
    value: SocialLink[];
    onChange: (value: SocialLink[]) => void;
}

const PLATFORMS = [
    'facebook',
    'twitter',
    'instagram',
    'linkedin',
    'youtube',
    'tiktok',
    'github',
    'website',
    'whatsapp',
    'telegram'
];

const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return Facebook;
        case 'twitter': return Twitter;
        case 'instagram': return Instagram;
        case 'linkedin': return Linkedin;
        case 'youtube': return Youtube;
        case 'github': return Github;
        case 'whatsapp': return MessageCircle;
        case 'telegram': return Send;
        case 'website': return Globe;
        default: return ExternalLink;
    }
};

export default function SocialLinksEditor({ value = [], onChange }: SocialLinksEditorProps) {
    const addLink = () => {
        onChange([
            ...value,
            { platform: 'facebook', url: '', isActive: true }
        ]);
    };

    const removeLink = (index: number) => {
        const newLinks = [...value];
        newLinks.splice(index, 1);
        onChange(newLinks);
    };

    const updateLink = (index: number, field: keyof SocialLink, val: any) => {
        const newLinks = [...value];
        newLinks[index] = { ...newLinks[index], [field]: val };
        onChange(newLinks);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Follow Us Links</label>
                <button
                    type="button"
                    onClick={addLink}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                    + Add Social Link
                </button>
            </div>
            
            {value.map((link, index) => {
                const Icon = getPlatformIcon(link.platform);
                return (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mt-1 p-2 bg-white rounded-full border border-gray-200 text-gray-500"><Icon className="h-5 w-5" /></div>
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Platform</label>
                                <select
                                    value={link.platform}
                                    onChange={(e) => updateLink(index, 'platform', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                >
                                    {PLATFORMS.map(p => (
                                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                                    placeholder="https://..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`active-${index}`}
                                checked={link.isActive}
                                onChange={(e) => updateLink(index, 'isActive', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`active-${index}`} className="ml-2 block text-sm text-gray-900">
                                Active
                            </label>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-600 hover:text-red-800 p-2 mt-1"
                        title="Remove link"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
                );
            })}
            
            {value.length === 0 && (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm">
                    No social links added yet. Click "Add Social Link" to start.
                </div>
            )}
        </div>
    );
}