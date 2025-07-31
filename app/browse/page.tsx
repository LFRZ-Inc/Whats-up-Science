'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Newsletter } from '@/lib/types'
import { formatDate, truncateText } from '@/lib/utils'

export default function BrowsePage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedField, setSelectedField] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const [allFields, setAllFields] = useState<string[]>([])

  useEffect(() => {
    fetchNewsletters()
    fetchFields()
  }, [sortBy])

  const fetchNewsletters = async () => {
    try {
      let query = supabase
        .from('newsletters')
        .select(`
          *,
          author:users!newsletters_author_id_fkey (
            id,
            full_name,
            field_of_study,
            institution,
            is_verified
          )
        `)
        .eq('is_public', true)
        .eq('author.is_verified', true)

      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false })
      } else {
        query = query.order('view_count', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching newsletters:', error)
      } else {
        setNewsletters(data || [])
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFields = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('field_of_study')
        .eq('is_verified', true)
        .not('field_of_study', 'is', null)

      if (!error && data) {
        const fields = Array.from(new Set(data.map(user => user.field_of_study)))
        setAllFields(fields.sort())
      }
    } catch (error) {
      console.error('Error fetching fields:', error)
    }
  }

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = 
      newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      newsletter.author?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.author?.field_of_study.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesField = selectedField === 'all' || newsletter.author?.field_of_study === selectedField

    return matchesSearch && matchesField
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deepBlue mb-2">Browse Science Newsletters</h1>
          <p className="text-gray-600">
            Discover cutting-edge research and insights from verified scientists
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                placeholder="Search by title, content, tags, author, or field..."
              />
            </div>

            {/* Field Filter */}
            <div>
              <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <select
                id="field"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="input-field"
              >
                <option value="all">All Fields</option>
                {allFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
                className="input-field"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-deepBlue">
              {loading ? 'Loading...' : `${filteredNewsletters.length} newsletter${filteredNewsletters.length !== 1 ? 's' : ''}`}
            </h2>
            {!loading && filteredNewsletters.length === 0 && (
              <p className="text-gray-500">No newsletters found matching your criteria</p>
            )}
          </div>
        </div>

        {/* Newsletters Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNewsletters.map((newsletter) => (
              <article key={newsletter.id} className="card hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-deepBlue mb-2 line-clamp-2">
                    <Link href={`/newsletter/${newsletter.slug}`} className="hover:underline">
                      {newsletter.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {truncateText(newsletter.content, 150)}
                  </p>
                </div>

                {/* Author Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-mintGreen rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-deepBlue">
                        {newsletter.author?.full_name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-deepBlue">
                        {newsletter.author?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {newsletter.author?.field_of_study} • {newsletter.author?.institution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {newsletter.tags && newsletter.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {newsletter.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag text-xs">
                          {tag}
                        </span>
                      ))}
                      {newsletter.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{newsletter.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatDate(newsletter.created_at)}</span>
                  <span>{newsletter.view_count} views</span>
                </div>

                <div className="mt-4">
                  <Link href={`/newsletter/${newsletter.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNewsletters.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletters found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all newsletters.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedField('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 