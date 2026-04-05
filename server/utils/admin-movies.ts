import { randomUUID } from 'node:crypto'
import { MOCK_MOVIES } from '~/mocks'
import type { Movie } from '~/types'

const adminMovies: Movie[] = structuredClone(MOCK_MOVIES)

const findMovieIndex = (id: string) => {
  return adminMovies.findIndex((movie) => movie.id === id)
}

export const listAdminMovies = () => {
  return [...adminMovies].sort((left, right) =>
    left.title.localeCompare(right.title),
  )
}

export const getAdminMovieById = (id: string) => {
  return adminMovies.find((movie) => movie.id === id) ?? null
}

export const createAdminMovie = (input: Omit<Movie, 'id'>) => {
  const movie: Movie = {
    ...input,
    id: randomUUID(),
  }

  adminMovies.unshift(movie)

  return movie
}

export const updateAdminMovie = (
  id: string,
  input: Partial<Omit<Movie, 'id'>>,
) => {
  const index = findMovieIndex(id)

  if (index < 0) {
    return null
  }

  adminMovies[index] = {
    ...adminMovies[index]!,
    ...input,
    id,
  }

  return adminMovies[index]!
}

export const deleteAdminMovie = (id: string) => {
  const index = findMovieIndex(id)

  if (index < 0) {
    return null
  }

  const [deleted] = adminMovies.splice(index, 1)
  return deleted ?? null
}
