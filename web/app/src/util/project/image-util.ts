import { IProjectViewModel } from '@app/types'
import Box1 from '../../assets/img/box1.jpg'
import Box2 from '../../assets/img/box2.jpg'
import Box3 from '../../assets/img/box3.jpg'
import Box4 from '../../assets/img/box4.jpg'
import placeholder from '../../assets/img/project-placeholder.jpg'

export const getMainImage = (project: IProjectViewModel) => {
  return (
    {
      '3e42e273-546d-4989-a97c-f6eb173e8450': Box1,
      'fa4d21c2-16a3-46cf-8162-98f4a82b59aa': Box2,
      '9e8f0c6f-1edf-4d68-a096-7a2bb4625c98': Box3,
      '00df0e23-22af-4959-874c-aca385b54eed': Box4,
    }[project.id] ?? placeholder
  )
}
