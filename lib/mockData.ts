export interface User {
  id: string
  username: string
  latitude: number
  longitude: number
}

export const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    username: `User ${i + 1}`,
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
  }))
}

