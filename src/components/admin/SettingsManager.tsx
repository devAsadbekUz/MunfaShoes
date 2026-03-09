import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Settings, Phone, Mail, MapPin, Instagram, Send } from 'lucide-react';

export function SettingsManager() {
    const [settings, setSettings] = useState({
        phone_number: '',
        phone_number_2: '',
        email: '',
        address_line1: '',
        address_line2: '',
        instagram_url: '',
        telegram_url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching settings:', error);
        } else if (data) {
            setSettings({
                phone_number: data.phone_number || '',
                phone_number_2: data.phone_number_2 || '',
                email: data.email || '',
                address_line1: data.address_line1 || '',
                address_line2: data.address_line2 || '',
                instagram_url: data.instagram_url || '',
                telegram_url: data.telegram_url || ''
            });
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase
            .from('site_settings')
            .update(settings)
            .eq('id', 1);

        if (error) {
            console.error('Error updating settings:', error);
            alert("Sozlamalarni saqlashda xatolik yuz berdi.");
        } else {
            alert("Sozlamalar muvaffaqiyatli saqlandi!");
            fetchSettings();
        }

        setIsSubmitting(false);
    };

    if (loading) {
        return <div className="text-gray-500">Yuklanmoqda...</div>;
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Phone className="text-[#FF5A7E]" size={20} /> Aloqa Ma'lumotlari
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Asosiy Telefon Rqami</label>
                        <Input
                            name="phone_number"
                            value={settings.phone_number}
                            onChange={handleChange}
                            placeholder="+998 90 123 45 67"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Qo'shimcha Telefon Raqami</label>
                        <Input
                            name="phone_number_2"
                            value={settings.phone_number_2}
                            onChange={handleChange}
                            placeholder="+998 90 987 65 43"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Elektron Pochta (Email)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <Input
                                name="email"
                                type="email"
                                value={settings.email}
                                onChange={handleChange}
                                placeholder="info@munfa.uz"
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="text-[#FF5A7E]" size={20} /> Manzil
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Manzil 1-qator (Masalan: Ko'cha nomi)</label>
                        <Input
                            name="address_line1"
                            value={settings.address_line1}
                            onChange={handleChange}
                            placeholder="J2VV+RF Buvaidy"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Manzil 2-qator (Masalan: Shahar, Viloyat)</label>
                        <Input
                            name="address_line2"
                            value={settings.address_line2}
                            onChange={handleChange}
                            placeholder="Qo'qon, Farg'ona, O'zbekiston"
                        />
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Settings className="text-[#FF5A7E]" size={20} /> Ijtimoiy Tarmoqlar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Havolasi</label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <Input
                                name="instagram_url"
                                value={settings.instagram_url}
                                onChange={handleChange}
                                placeholder="https://instagram.com/munfa_uz"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telegram Havolasi</label>
                        <div className="relative">
                            <Send className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <Input
                                name="telegram_url"
                                value={settings.telegram_url}
                                onChange={handleChange}
                                placeholder="https://t.me/munfa_uz"
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90 px-8 py-6 text-lg"
                >
                    {isSubmitting ? 'Saqlanmoqda...' : 'Barcha Sozlamalarni Saqlash'}
                </Button>
            </div>
        </form>
    );
}
