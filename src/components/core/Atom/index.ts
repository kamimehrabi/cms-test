import Button from './Button'
import Icon from './Icon'
import * as Typography from './Typography'
import * as Card from "./Card"
import Select from './Select'
import { Input } from './Input'
import * as Modal from "./Modal"

const Atom = {
  Button,
  ...Icon,
  ...Typography,
  Select,
  ...Modal
}

export const UIComponent = {
  ...Input,
  ...Card,
}

export default Atom

