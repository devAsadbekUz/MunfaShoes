import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

export function MessageManager() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setMessages(data);
        }
        setLoading(false);
    };

    const deleteMessage = async (id: number) => {
        if (!confirm('Ushbu xabarni o\'chirmoqchimisiz?')) return;
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (!error) fetchMessages();
    };

    if (loading) return <div className="text-center py-10">Yuklanmoqda...</div>;

    return (
        <div className="space-y-6">
            {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Hozircha xabarlar yo'q.</div>
            ) : (
                messages.map((msg) => (
                    <Card key={msg.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-gray-800">{msg.name}</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                        {new Date(msg.created_at).toLocaleString('uz-UZ')}
                                    </span>
                                </div>
                                <p className="text-[#FF5A7E] font-semibold">{msg.phone}</p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {msg.message}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMessage(msg.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 ml-4"
                            >
                                <Trash2 size={20} />
                            </Button>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
}
