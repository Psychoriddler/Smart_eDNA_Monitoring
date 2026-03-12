import React, { useState, useEffect } from 'react';
import { Plus, Search, Heart, MessageCircle, Download, Calendar, Users } from 'lucide-react';
import { ResearchPaper, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const ResearchPapers: React.FC = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [newComment, setNewComment] = useState('');

  // Mock data for research papers
  useEffect(() => {
    const mockPapers: ResearchPaper[] = [
      {
        id: '1',
        title: 'Environmental DNA Metabarcoding Reveals Hidden Biodiversity in Arctic Waters',
        abstract: 'This study presents a comprehensive analysis of marine biodiversity in Arctic waters using environmental DNA metabarcoding techniques. We identified 342 species across multiple taxonomic groups, including previously unknown species distributions.',
        authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Lisa Anderson'],
        institution: 'Arctic Research Institute',
        publishedDate: '2024-12-15',
        tags: ['Arctic', 'Marine Biology', 'Metabarcoding', 'Biodiversity'],
        likes: 28,
        comments: 5,
        authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=2563eb&color=fff',
        isLiked: false
      },
      {
        id: '2',
        title: 'Novel Fungal Species Discovery Through eDNA Analysis in Tropical Rainforests',
        abstract: 'Using advanced eDNA sequencing techniques, we discovered 15 new fungal species in Costa Rican rainforests. Our methodology demonstrates the potential for rapid biodiversity assessment in tropical ecosystems.',
        authors: ['Dr. Carlos Rodriguez', 'Dr. Emma Thompson'],
        institution: 'Tropical Ecology Research Center',
        publishedDate: '2024-12-10',
        tags: ['Fungi', 'Tropical Ecology', 'Species Discovery', 'eDNA'],
        likes: 42,
        comments: 8,
        authorAvatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=2563eb&color=fff',
        isLiked: true
      },
      {
        id: '3',
        title: 'Freshwater Fish Diversity Assessment Using Environmental DNA in European Rivers',
        abstract: 'A large-scale study across 50 European river systems using eDNA metabarcoding to assess freshwater fish diversity. Results show significant diversity loss in urbanized areas compared to pristine environments.',
        authors: ['Prof. Hans Mueller', 'Dr. Anna Kowalski', 'Dr. James Wilson'],
        institution: 'European Freshwater Research Network',
        publishedDate: '2024-12-05',
        tags: ['Freshwater', 'Fish Diversity', 'European Rivers', 'Conservation'],
        likes: 35,
        comments: 12,
        authorAvatar: 'https://ui-avatars.com/api/?name=Hans+Mueller&background=2563eb&color=fff',
        isLiked: false
      }
    ];
    setPapers(mockPapers);
  }, []);

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLike = (paperId: string) => {
    setPapers(prev => prev.map(paper => {
      if (paper.id === paperId) {
        return {
          ...paper,
          isLiked: !paper.isLiked,
          likes: paper.isLiked ? paper.likes - 1 : paper.likes + 1
        };
      }
      return paper;
    }));
  };

  const handlePublish = (formData: any) => {
    const newPaper: ResearchPaper = {
      id: Date.now().toString(),
      title: formData.title,
      abstract: formData.abstract,
      authors: [user?.name || 'Anonymous'],
      institution: user?.institution || 'Unknown Institution',
      publishedDate: new Date().toISOString().split('T')[0],
      tags: formData.tags.split(',').map((tag: string) => tag.trim()),
      likes: 0,
      comments: 0,
      authorAvatar: user?.avatar,
      isLiked: false
    };
    
    setPapers(prev => [newPaper, ...prev]);
    setShowPublishForm(false);
    toast.success('Research paper published successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Research Papers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and share cutting-edge eDNA research with the scientific community
          </p>
        </div>
        
        <button
          onClick={() => setShowPublishForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Paper</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search papers by title, tags, or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPaper(paper)}
          >
            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={paper.authorAvatar}
                alt={paper.authors[0]}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {paper.authors[0]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {paper.institution}
                </p>
              </div>
            </div>

            {/* Title and Abstract */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {paper.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {paper.abstract}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {paper.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {paper.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  +{paper.tags.length - 3} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                </div>
                {paper.authors.length > 1 && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{paper.authors.length} authors</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(paper.id);
                  }}
                  className={`flex items-center space-x-1 ${
                    paper.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  } transition-colors`}
                >
                  <Heart className={`h-4 w-4 ${paper.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{paper.likes}</span>
                </button>
                
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{paper.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Form Modal */}
      {showPublishForm && (
        <PublishPaperModal
          onClose={() => setShowPublishForm(false)}
          onPublish={handlePublish}
        />
      )}

      {/* Paper Detail Modal */}
      {selectedPaper && (
        <PaperDetailModal
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
};

// Publish Paper Modal Component
const PublishPaperModal: React.FC<{
  onClose: () => void;
  onPublish: (data: any) => void;
}> = ({ onClose, onPublish }) => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.abstract) {
      onPublish(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Publish Research Paper
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your paper title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Abstract
              </label>
              <textarea
                required
                rows={6}
                value={formData.abstract}
                onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your abstract..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="eDNA, Biodiversity, Marine Biology..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Paper Detail Modal Component
const PaperDetailModal: React.FC<{
  paper: ResearchPaper;
  onClose: () => void;
}> = ({ paper, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">
              {paper.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Authors and Institution */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Authors</h3>
              <p className="text-gray-600 dark:text-gray-400">{paper.authors.join(', ')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{paper.institution}</p>
            </div>
            
            {/* Abstract */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Abstract</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{paper.abstract}</p>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Published on {new Date(paper.publishedDate).toLocaleDateString()}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Heart className={`h-5 w-5 ${paper.isLiked ? 'fill-current text-red-500' : ''}`} />
                  <span>{paper.likes}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>{paper.comments}</span>
                </div>
                <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
