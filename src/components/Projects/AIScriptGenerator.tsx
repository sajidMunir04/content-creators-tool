import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Copy, 
  Download, 
  RefreshCw, 
  X, 
  Wand2,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Project, Task } from '../../types';

interface AIScriptGeneratorProps {
  project: Project;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

interface ScriptSection {
  title: string;
  content: string;
  duration?: string;
}

interface GeneratedScript {
  title: string;
  overview: string;
  sections: ScriptSection[];
  totalDuration: string;
  wordCount: number;
  generatedAt: string;
}

export default function AIScriptGenerator({ project, tasks, isOpen, onClose }: AIScriptGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [scriptType, setScriptType] = useState<'video' | 'podcast' | 'presentation' | 'blog'>('video');
  const [targetAudience, setTargetAudience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [duration, setDuration] = useState<'5' | '10' | '15' | '30' | '60'>('10');
  const [tone, setTone] = useState<'professional' | 'casual' | 'educational' | 'entertaining'>('educational');

  const generateScript = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate hardcoded script based on project and tasks
    const script = generateHardcodedScript();
    setGeneratedScript(script);
    setIsGenerating(false);
  };

  const generateHardcodedScript = (): GeneratedScript => {
    const completedTasks = tasks.filter(t => t.status === 'Done');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const pendingTasks = tasks.filter(t => t.status === 'To Do');

    // Generate script based on project category and type
    let sections: ScriptSection[] = [];
    let overview = '';

    if (scriptType === 'video') {
      overview = `Welcome to this comprehensive guide on ${project.title}. In this ${duration}-minute video, we'll explore ${project.description.toLowerCase()} and provide you with actionable insights to help you succeed.`;
      
      sections = [
        {
          title: 'Introduction & Hook',
          content: `Hey everyone! Welcome back to the channel. Today we're diving deep into ${project.title}. ${getHookByCategory(project.category)} By the end of this video, you'll have a clear understanding of ${project.description.toLowerCase()}.`,
          duration: '1-2 min'
        },
        {
          title: 'Problem Statement',
          content: `Let's start by addressing the main challenge: ${getProblemStatement(project.category)}. This is something that affects ${getAudienceByLevel(targetAudience)} and can significantly impact your ${project.category.toLowerCase()} success.`,
          duration: '2-3 min'
        },
        {
          title: 'Solution Overview',
          content: `Here's how we're going to solve this: ${getSolutionOverview(project)}. We'll break this down into ${tasks.length} key steps that you can implement immediately.`,
          duration: `${Math.ceil(parseInt(duration) * 0.4)}-${Math.ceil(parseInt(duration) * 0.5)} min`
        },
        {
          title: 'Step-by-Step Implementation',
          content: generateImplementationSteps(tasks, project.category),
          duration: `${Math.ceil(parseInt(duration) * 0.3)}-${Math.ceil(parseInt(duration) * 0.4)} min`
        },
        {
          title: 'Common Pitfalls & Tips',
          content: `Before we wrap up, let me share some common mistakes to avoid: ${getCommonPitfalls(project.category)}. Pro tip: ${getProTip(project.category)}.`,
          duration: '1-2 min'
        },
        {
          title: 'Call to Action & Conclusion',
          content: `That's a wrap! If this video helped you understand ${project.title.toLowerCase()}, please give it a thumbs up and subscribe for more ${project.category.toLowerCase()} content. What's your biggest challenge with ${project.category.toLowerCase()}? Let me know in the comments below!`,
          duration: '1 min'
        }
      ];
    } else if (scriptType === 'podcast') {
      overview = `In this episode, we're exploring ${project.title}. ${project.description} Join me as we break down the key concepts and share practical insights.`;
      
      sections = [
        {
          title: 'Podcast Intro',
          content: `Welcome to [Podcast Name], the show where we dive deep into ${project.category.toLowerCase()}. I'm your host [Name], and today we're talking about ${project.title}.`,
          duration: '1 min'
        },
        {
          title: 'Topic Introduction',
          content: `So, ${project.title} - this is something I've been working on recently, and I thought it would be valuable to share my insights with you. ${project.description}`,
          duration: '2-3 min'
        },
        {
          title: 'Deep Dive Discussion',
          content: generatePodcastDiscussion(project, tasks),
          duration: `${Math.ceil(parseInt(duration) * 0.6)}-${Math.ceil(parseInt(duration) * 0.7)} min`
        },
        {
          title: 'Key Takeaways',
          content: `Let me summarize the key points we've covered today: ${generateKeyTakeaways(tasks)}`,
          duration: '2-3 min'
        },
        {
          title: 'Outro & Next Episode',
          content: `That's all for today's episode. If you enjoyed this discussion about ${project.title.toLowerCase()}, please subscribe and leave a review. Next week, we'll be covering [Next Topic]. Until then, keep creating!`,
          duration: '1 min'
        }
      ];
    } else if (scriptType === 'presentation') {
      overview = `This presentation covers ${project.title}, providing a comprehensive overview of ${project.description.toLowerCase()} for ${targetAudience} audiences.`;
      
      sections = [
        {
          title: 'Title Slide & Introduction',
          content: `Good [morning/afternoon], everyone. Today I'll be presenting on ${project.title}. My name is [Name], and I'll be your guide through this ${duration}-minute presentation.`,
          duration: '1 min'
        },
        {
          title: 'Agenda & Objectives',
          content: `Here's what we'll cover today: [List agenda items]. By the end of this presentation, you'll understand ${project.description.toLowerCase()}.`,
          duration: '1 min'
        },
        {
          title: 'Main Content',
          content: generatePresentationContent(project, tasks),
          duration: `${Math.ceil(parseInt(duration) * 0.7)}-${Math.ceil(parseInt(duration) * 0.8)} min`
        },
        {
          title: 'Q&A Session',
          content: `Now I'd like to open the floor for questions. Please feel free to ask about any aspect of ${project.title} that we've covered today.`,
          duration: `${Math.ceil(parseInt(duration) * 0.15)} min`
        },
        {
          title: 'Conclusion & Next Steps',
          content: `Thank you for your attention. The key takeaways are: ${generateKeyTakeaways(tasks)}. For next steps, I recommend ${getNextSteps(project.category)}.`,
          duration: '1-2 min'
        }
      ];
    } else { // blog
      overview = `This blog post explores ${project.title}, offering detailed insights into ${project.description.toLowerCase()} with practical examples and actionable advice.`;
      
      sections = [
        {
          title: 'Introduction',
          content: `${project.title} is becoming increasingly important in today's ${project.category.toLowerCase()} landscape. ${project.description} In this comprehensive guide, we'll explore everything you need to know.`
        },
        {
          title: 'Background & Context',
          content: `To understand ${project.title}, we first need to look at the broader context. ${getBackgroundContext(project.category)}`
        },
        {
          title: 'Main Content',
          content: generateBlogContent(project, tasks)
        },
        {
          title: 'Practical Examples',
          content: `Let's look at some real-world examples of ${project.title} in action: ${generateExamples(project.category)}`
        },
        {
          title: 'Best Practices',
          content: `Based on industry experience, here are the best practices for ${project.title.toLowerCase()}: ${getBestPractices(project.category)}`
        },
        {
          title: 'Conclusion',
          content: `${project.title} represents a significant opportunity for ${getAudienceByLevel(targetAudience)}. By following the strategies outlined in this guide, you'll be well-equipped to ${getExpectedOutcome(project.category)}.`
        }
      ];
    }

    const wordCount = sections.reduce((acc, section) => acc + section.content.split(' ').length, 0);
    
    return {
      title: `${project.title} - ${scriptType.charAt(0).toUpperCase() + scriptType.slice(1)} Script`,
      overview,
      sections,
      totalDuration: duration + ' minutes',
      wordCount,
      generatedAt: new Date().toISOString()
    };
  };

  const getHookByCategory = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'If you\'ve ever struggled with creating engaging video content, this video is for you.';
      case 'Blog': return 'Writing compelling blog posts can be challenging, but it doesn\'t have to be.';
      case 'Podcast': return 'Podcasting is exploding in popularity, and there\'s never been a better time to start.';
      case 'Social Media': return 'Social media success isn\'t about luck - it\'s about strategy.';
      default: return 'Content creation is an art and a science, and today we\'re mastering both.';
    }
  };

  const getProblemStatement = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'Many creators struggle with low engagement and subscriber growth despite putting in hours of work.';
      case 'Blog': return 'Most blog posts get lost in the noise, failing to attract readers or drive meaningful engagement.';
      case 'Podcast': return 'Starting a podcast can feel overwhelming with technical setup, content planning, and audience building.';
      case 'Social Media': return 'Brands and creators often post inconsistently without a clear strategy, leading to poor results.';
      default: return 'Content creators face numerous challenges in building an audience and creating engaging material.';
    }
  };

  const getSolutionOverview = (project: Project): string => {
    return `We'll implement a systematic approach to ${project.title.toLowerCase()} that addresses each challenge step by step. This method has been tested and proven effective for ${project.category.toLowerCase()} success.`;
  };

  const generateImplementationSteps = (tasks: Task[], category: string): string => {
    const steps = tasks.slice(0, 5).map((task, index) => 
      `${index + 1}. ${task.title}: ${task.description || `Focus on ${task.title.toLowerCase()} to achieve optimal results.`}`
    ).join('\n\n');
    
    return `Here are the key implementation steps:\n\n${steps}\n\nEach step builds on the previous one, creating a comprehensive approach to ${category.toLowerCase()} success.`;
  };

  const getCommonPitfalls = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'Inconsistent posting schedule, poor thumbnail design, and neglecting audience engagement.';
      case 'Blog': return 'Writing for search engines instead of humans, neglecting SEO basics, and inconsistent publishing.';
      case 'Podcast': return 'Poor audio quality, lack of show notes, and irregular episode releases.';
      case 'Social Media': return 'Over-promotion, ignoring comments, and posting without a content calendar.';
      default: return 'Lack of consistency, poor planning, and not understanding your target audience.';
    }
  };

  const getProTip = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'Always create your thumbnail before filming - it will guide your content creation.';
      case 'Blog': return 'Write your conclusion first to ensure your entire post supports your main message.';
      case 'Podcast': return 'Record a few extra minutes of conversation - the best content often comes from spontaneous moments.';
      case 'Social Media': return 'Engage with your audience within the first hour of posting for maximum reach.';
      default: return 'Consistency beats perfection - it\'s better to publish regularly than to wait for perfect content.';
    }
  };

  const generatePodcastDiscussion = (project: Project, tasks: Task[]): string => {
    return `Let's break down ${project.title} into its core components. ${project.description} 

I've been working on this through several key areas: ${tasks.slice(0, 3).map(t => t.title).join(', ')}. Each of these represents a crucial piece of the puzzle.

What I've learned is that ${project.category.toLowerCase()} success isn't just about one thing - it's about how all these elements work together. Let me share some specific insights from my experience...`;
  };

  const generateKeyTakeaways = (tasks: Task[]): string => {
    return tasks.slice(0, 3).map((task, index) => 
      `${index + 1}. ${task.title} is essential for success`
    ).join(', ') + '. Remember, implementation is key - knowledge without action leads nowhere.';
  };

  const generatePresentationContent = (project: Project, tasks: Task[]): string => {
    return `[Slide 1: Overview] ${project.description}

[Slide 2: Key Components] The main elements we'll cover include: ${tasks.slice(0, 4).map(t => t.title).join(', ')}.

[Slide 3-6: Detailed Breakdown] Each component plays a vital role in achieving ${project.title}. Let's examine each one in detail...

[Slide 7: Integration] How these elements work together to create a comprehensive approach.`;
  };

  const generateBlogContent = (project: Project, tasks: Task[]): string => {
    return `## Understanding ${project.title}

${project.description} This comprehensive approach involves several key components that work together to achieve optimal results.

### Key Components

${tasks.map((task, index) => `#### ${index + 1}. ${task.title}

${task.description || `This component focuses on ${task.title.toLowerCase()} and its impact on overall success. Implementation requires careful planning and consistent execution.`}

`).join('')}

### Implementation Strategy

The most effective approach is to tackle these components systematically, building momentum as you progress through each phase.`;
  };

  const getBackgroundContext = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'The video content landscape has evolved dramatically, with algorithm changes and increased competition requiring more strategic approaches.';
      case 'Blog': return 'Content marketing has become increasingly sophisticated, with search engines prioritizing quality, relevance, and user experience.';
      case 'Podcast': return 'The podcasting industry has experienced explosive growth, creating both opportunities and challenges for new creators.';
      case 'Social Media': return 'Social media platforms continue to evolve, with new features and algorithm changes affecting how content is discovered and consumed.';
      default: return 'The digital content landscape is constantly evolving, requiring creators to adapt their strategies and approaches.';
    }
  };

  const generateExamples = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'Successful channels like [Example 1] and [Example 2] demonstrate effective thumbnail strategies, consistent branding, and audience engagement techniques.';
      case 'Blog': return 'Leading blogs in the industry showcase excellent SEO practices, compelling headlines, and valuable content that resonates with their target audience.';
      case 'Podcast': return 'Popular podcasts excel at creating compelling show formats, maintaining consistent quality, and building strong listener communities.';
      case 'Social Media': return 'Brands that succeed on social media demonstrate consistent posting, authentic engagement, and strategic use of platform-specific features.';
      default: return 'Successful content creators across all platforms share common traits: consistency, quality, and deep understanding of their audience.';
    }
  };

  const getBestPractices = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'Optimize for search and discovery, create compelling thumbnails, maintain consistent branding, and engage actively with your community.';
      case 'Blog': return 'Focus on SEO fundamentals, create valuable content, optimize for readability, and promote across multiple channels.';
      case 'Podcast': return 'Invest in quality audio equipment, create detailed show notes, maintain a consistent schedule, and actively promote episodes.';
      case 'Social Media': return 'Develop a content calendar, engage authentically with followers, use platform-specific features, and analyze performance metrics.';
      default: return 'Plan your content strategy, maintain consistency, focus on quality over quantity, and always prioritize your audience\'s needs.';
    }
  };

  const getAudienceByLevel = (level: string): string => {
    switch (level) {
      case 'beginner': return 'newcomers and those just starting their journey';
      case 'intermediate': return 'creators with some experience looking to level up';
      case 'advanced': return 'experienced professionals seeking optimization and advanced strategies';
      default: return 'content creators at all levels';
    }
  };

  const getExpectedOutcome = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'grow your channel, increase engagement, and build a loyal subscriber base';
      case 'Blog': return 'attract more readers, improve search rankings, and establish thought leadership';
      case 'Podcast': return 'build an engaged audience, improve production quality, and grow your listener base';
      case 'Social Media': return 'increase engagement, build brand awareness, and drive meaningful conversions';
      default: return 'achieve your content creation goals and build a successful online presence';
    }
  };

  const getNextSteps = (category: string): string => {
    switch (category) {
      case 'YouTube': return 'starting with content planning and thumbnail creation';
      case 'Blog': return 'conducting keyword research and creating an editorial calendar';
      case 'Podcast': return 'setting up your recording equipment and planning your first episodes';
      case 'Social Media': return 'developing a content calendar and establishing your brand voice';
      default: return 'creating a detailed action plan and setting measurable goals';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadScript = () => {
    if (!generatedScript) return;
    
    const scriptText = `${generatedScript.title}\n\n${generatedScript.overview}\n\n${generatedScript.sections.map(section => 
      `${section.title}\n${section.duration ? `Duration: ${section.duration}\n` : ''}${section.content}\n`
    ).join('\n')}\n\nGenerated on: ${new Date(generatedScript.generatedAt).toLocaleString()}\nWord Count: ${generatedScript.wordCount}`;
    
    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedScript.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">AI Script Generator</h3>
                <p className="text-sm text-gray-600">Generate professional scripts for {project.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!generatedScript ? (
            /* Configuration Panel */
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Project Context</span>
                </div>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Project:</strong> {project.title}
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Description:</strong> {project.description}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Tasks:</strong> {tasks.length} tasks ({tasks.filter(t => t.status === 'Done').length} completed)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Script Type
                  </label>
                  <select
                    value={scriptType}
                    onChange={(e) => setScriptType(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="video">Video Script</option>
                    <option value="podcast">Podcast Script</option>
                    <option value="presentation">Presentation Script</option>
                    <option value="blog">Blog Post Outline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone & Style
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="educational">Educational</option>
                    <option value="entertaining">Entertaining</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">AI Generation Preview</span>
                </div>
                <p className="text-sm text-yellow-800">
                  The AI will generate a {scriptType} script for "{project.title}" targeting {targetAudience} audiences 
                  with a {tone} tone, approximately {duration} minutes long. The script will incorporate your project 
                  tasks and be optimized for {project.category} content.
                </p>
              </div>

              <button
                onClick={generateScript}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate AI Script
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Generated Script Display */
            <div className="p-6 space-y-6">
              {/* Script Header */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Script Generated Successfully!</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{generatedScript.title}</h2>
                <p className="text-gray-700 mb-3">{generatedScript.overview}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{generatedScript.totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{generatedScript.wordCount} words</span>
                  </div>
                  <div>Generated: {new Date(generatedScript.generatedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(generatedScript.sections.map(s => `${s.title}\n${s.content}`).join('\n\n'))}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Copy className="h-4 w-4" />
                  Copy Script
                </button>
                <button
                  onClick={downloadScript}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => setGeneratedScript(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate New
                </button>
              </div>

              {/* Script Sections */}
              <div className="space-y-6">
                {generatedScript.sections.map((section, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      {section.duration && (
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                          {section.duration}
                        </span>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(section.content)}
                      className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Section
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}