import { Plus, Trash2, MessageCircle } from 'lucide-react';

export interface FAQ {
    question: string;
    answer: string;
}

export interface FAQCategory {
    title: string;
    description?: string;
    chatLink?: string;
    faqs: FAQ[];
}

interface FAQEditorProps {
    value: FAQCategory[];
    onChange: (value: FAQCategory[]) => void;
}

export function FAQEditor({ value = [], onChange }: FAQEditorProps) {
    const addCategory = () => {
        onChange([...value, { title: 'New Category', faqs: [] }]);
    };

    const removeCategory = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const updateCategory = (index: number, field: Exclude<keyof FAQCategory, 'faqs'>, val: string) => {
        const newValue = [...value];
        newValue[index] = { ...newValue[index], [field]: val };
        onChange(newValue);
    };

    const addFAQ = (categoryIndex: number) => {
        const newValue = [...value];
        const category = { ...newValue[categoryIndex] };
        const faqs = category.faqs ? [...category.faqs] : [];
        
        faqs.push({ question: '', answer: '' });
        category.faqs = faqs;
        newValue[categoryIndex] = category;
        onChange(newValue);
    };

    const removeFAQ = (categoryIndex: number, faqIndex: number) => {
        const newValue = [...value];
        const newFaqs = [...(newValue[categoryIndex].faqs || [])];
        newFaqs.splice(faqIndex, 1);
        newValue[categoryIndex] = { ...newValue[categoryIndex], faqs: newFaqs };
        onChange(newValue);
    };

    const updateFAQ = (categoryIndex: number, faqIndex: number, field: keyof FAQ, val: string) => {
        const newValue = [...value];
        const newFaqs = [...(newValue[categoryIndex].faqs || [])];
        newFaqs[faqIndex] = {
            ...newFaqs[faqIndex],
            [field]: val
        };
        newValue[categoryIndex] = { ...newValue[categoryIndex], faqs: newFaqs };
        onChange(newValue);
    };

    return (
        <div className="space-y-8">
            {value.map((category, catIndex) => (
                <div key={catIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Title</label>
                                    <input
                                        type="text"
                                        value={category.title || ''}
                                        onChange={(e) => updateCategory(catIndex, 'title', e.target.value)}
                                        placeholder="e.g., General Questions"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chat Link (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MessageCircle className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={category.chatLink || ''}
                                            onChange={(e) => updateCategory(catIndex, 'chatLink', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={category.description || ''}
                                    onChange={(e) => updateCategory(catIndex, 'description', e.target.value)}
                                    placeholder="Brief description of this category..."
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeCategory(catIndex)}
                            className="ml-4 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                            title="Remove Category"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4 pl-4 border-l-2 border-indigo-100">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Questions</h4>
                        
                        {category.faqs && category.faqs.map((faq, faqIndex) => (
                            <div key={faqIndex} className="flex gap-4 items-start bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={faq.question || ''}
                                        onChange={(e) => updateFAQ(catIndex, faqIndex, 'question', e.target.value)}
                                        placeholder="Question"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <textarea
                                        value={faq.answer || ''}
                                        onChange={(e) => updateFAQ(catIndex, faqIndex, 'answer', e.target.value)}
                                        placeholder="Answer"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFAQ(catIndex, faqIndex)}
                                    className="text-gray-400 hover:text-red-500 mt-2 p-1"
                                    title="Remove Question"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={() => addFAQ(catIndex)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 py-2"
                        >
                            <Plus className="h-4 w-4" /> Add Question
                        </button>
                    </div>
                </div>
            ))}
            
            <button
                type="button"
                onClick={addCategory}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus className="h-5 w-5" /> Add New FAQ Category
            </button>
        </div>
    );
}