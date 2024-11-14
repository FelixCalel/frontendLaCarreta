// iconCatalog.js

import { 
  AiFillDashboard, AiOutlineShoppingCart, AiOutlineFileText, AiOutlineHome, AiOutlineUser, AiOutlineSetting, 
  AiFillPieChart, AiFillSignal, AiFillFolderOpen, AiOutlineNotification, AiOutlineTeam, AiOutlineCalendar, 
  AiOutlineMail, AiOutlinePhone, AiOutlinePoweroff, AiOutlineQuestionCircle, AiOutlineCloud, AiOutlineTool, 
  AiOutlineCheckCircle, AiOutlineSafetyCertificate, AiOutlineUnlock 
} from 'react-icons/ai';

import { 
  FaFileInvoice, FaCog, FaUsers, FaUserFriends, FaRegFileAlt, FaBoxOpen, FaChartBar, FaCashRegister, FaClipboardList, 
  FaBook, FaBullhorn, FaChartLine, FaTools, FaNetworkWired, FaUserShield, FaShippingFast, 
  FaBell, FaCalendarAlt, FaCloudUploadAlt, FaDatabase, FaEdit, FaEnvelopeOpenText, FaHeadset, FaLifeRing, FaLock, 
  FaCheckCircle, FaThumbsUp, FaKey, FaClipboardCheck, FaLockOpen 
} from 'react-icons/fa';

import { 
  MdDashboard, MdShoppingCart, MdSettings, MdPerson, MdAnalytics, MdInventory, MdAttachMoney, MdAssignment, MdEvent, 
  MdPeople, MdSecurity, MdBackup, MdBuild, MdEmail, MdFeedback, MdHelp, MdLock, MdLockOutline, MdPowerSettingsNew, 
  MdVerifiedUser, MdHowToReg, MdApproval, MdAssignmentTurnedIn 
} from 'react-icons/md';

import { 
  BsFillPersonFill, BsCartCheck, BsGraphUp, BsClipboard, BsFileText, BsFileEarmarkText, BsFillShieldLockFill, 
  BsFillEnvelopeFill, BsFillChatSquareTextFill, BsFillAlarmFill, BsFillCalendarCheckFill, BsFillCloudUploadFill, 
  BsGearFill, BsFillHouseDoorFill, BsFillFileLockFill, BsFillKeyFill, BsFillLightningChargeFill, BsCheckCircle, 
  BsShieldCheck, BsFileLock, BsPersonCheckFill 
} from 'react-icons/bs';

import { 
  FiUser, FiSettings, FiFileText, FiHome, FiShoppingCart, FiUsers, FiClipboard, FiTrendingUp, FiAlertCircle, 
  FiClock, FiShield, FiTarget, FiArchive, FiBell, FiCalendar, FiCpu, FiDatabase, FiEdit, FiHeadphones, FiPower, 
  FiCheckCircle, FiUnlock, FiThumbsUp 
} from 'react-icons/fi';

// Mapa de iconos
const iconCatalog = {
  // Íconos de Ant Design (Ai)
  AiFillDashboard: AiFillDashboard,
  AiOutlineShoppingCart: AiOutlineShoppingCart,
  AiOutlineFileText: AiOutlineFileText,
  AiOutlineHome: AiOutlineHome,
  AiOutlineUser: AiOutlineUser,
  AiOutlineSetting: AiOutlineSetting,
  AiFillPieChart: AiFillPieChart,
  AiFillSignal: AiFillSignal,
  AiFillFolderOpen: AiFillFolderOpen,
  AiOutlineNotification: AiOutlineNotification,
  AiOutlineTeam: AiOutlineTeam,
  AiOutlineCalendar: AiOutlineCalendar,
  AiOutlineMail: AiOutlineMail,
  AiOutlinePhone: AiOutlinePhone,
  AiOutlinePoweroff: AiOutlinePoweroff,
  AiOutlineQuestionCircle: AiOutlineQuestionCircle,
  AiOutlineCloud: AiOutlineCloud,
  AiOutlineTool: AiOutlineTool,
  AiOutlineCheckCircle: AiOutlineCheckCircle,  // Autorización/Verificación
  AiOutlineSafetyCertificate: AiOutlineSafetyCertificate, // Certificado de seguridad
  AiOutlineUnlock: AiOutlineUnlock, // Desbloqueo

  // Íconos de FontAwesome (Fa)
  FaFileInvoice: FaFileInvoice,
  FaCog: FaCog,
  FaUsers: FaUsers,
  FaUserFriends: FaUserFriends,
  FaRegFileAlt: FaRegFileAlt,
  FaBoxOpen: FaBoxOpen,
  FaChartBar: FaChartBar,
  FaCashRegister: FaCashRegister,
  FaClipboardList: FaClipboardList,
  FaBook: FaBook,
  FaBullhorn: FaBullhorn,
  FaChartLine: FaChartLine,
  FaTools: FaTools,
  FaNetworkWired: FaNetworkWired,
  FaUserShield: FaUserShield,  // Seguridad y control
  FaShippingFast: FaShippingFast,
  FaBell: FaBell,
  FaCalendarAlt: FaCalendarAlt,
  FaCloudUploadAlt: FaCloudUploadAlt,
  FaDatabase: FaDatabase,
  FaEdit: FaEdit,
  FaEnvelopeOpenText: FaEnvelopeOpenText,
  FaHeadset: FaHeadset,
  FaLifeRing: FaLifeRing,
  FaLock: FaLock,
  FaCheckCircle: FaCheckCircle,  // Aprobación/Verificación
  FaThumbsUp: FaThumbsUp,  // Aprobación
  FaKey: FaKey,  // Acceso/Permiso
  FaClipboardCheck: FaClipboardCheck,  // Tarea completada
  FaLockOpen: FaLockOpen,  // Desbloqueo

  // Íconos de Material Design (Md)
  MdDashboard: MdDashboard,
  MdShoppingCart: MdShoppingCart,
  MdSettings: MdSettings,
  MdPerson: MdPerson,
  MdAnalytics: MdAnalytics,
  MdInventory: MdInventory,
  MdAttachMoney: MdAttachMoney,
  MdAssignment: MdAssignment,
  MdEvent: MdEvent,
  MdPeople: MdPeople,
  MdSecurity: MdSecurity,  // Seguridad
  MdBackup: MdBackup,
  MdBuild: MdBuild,
  MdEmail: MdEmail,
  MdFeedback: MdFeedback,
  MdHelp: MdHelp,
  MdLock: MdLock,
  MdLockOutline: MdLockOutline,
  MdPowerSettingsNew: MdPowerSettingsNew,
  MdVerifiedUser: MdVerifiedUser,  // Usuario Verificado
  MdHowToReg: MdHowToReg,  // Persona registrada/autorizada
  MdApproval: MdApproval,  // Aprobación
  MdAssignmentTurnedIn: MdAssignmentTurnedIn,  // Tarea completada

  // Íconos de Bootstrap (Bs)
  BsFillPersonFill: BsFillPersonFill,
  BsCartCheck: BsCartCheck,
  BsGraphUp: BsGraphUp,
  BsClipboard: BsClipboard,
  BsFileText: BsFileText,
  BsFileEarmarkText: BsFileEarmarkText,
  BsFillShieldLockFill: BsFillShieldLockFill,  // Escudo con candado (seguridad)
  BsFillEnvelopeFill: BsFillEnvelopeFill,
  BsFillChatSquareTextFill: BsFillChatSquareTextFill,
  BsFillAlarmFill: BsFillAlarmFill,
  BsFillCalendarCheckFill: BsFillCalendarCheckFill,
  BsFillCloudUploadFill: BsFillCloudUploadFill,
  BsGearFill: BsGearFill,
  BsFillHouseDoorFill: BsFillHouseDoorFill,
  BsFillFileLockFill: BsFillFileLockFill,  // Archivo protegido
  BsFillKeyFill: BsFillKeyFill,  // Llave (permiso)
  BsFillLightningChargeFill: BsFillLightningChargeFill,
  BsCheckCircle: BsCheckCircle,  // Verificación
  BsShieldCheck: BsShieldCheck,  // Escudo con verificación
  BsFileLock: BsFileLock,  // Archivo con candado
  BsPersonCheckFill: BsPersonCheckFill,  // Persona autorizada

  // Íconos de Feather Icons (Fi)
  FiUser: FiUser,
  FiSettings: FiSettings,
  FiFileText: FiFileText,
  FiHome: FiHome,
  FiShoppingCart: FiShoppingCart,
  FiUsers: FiUsers,
  FiClipboard: FiClipboard,
  FiTrendingUp: FiTrendingUp,
  FiAlertCircle: FiAlertCircle,
  FiClock: FiClock,
  FiShield: FiShield,  // Seguridad/Escudo
  FiTarget: FiTarget,
  FiArchive: FiArchive,
  FiBell: FiBell,
  FiCalendar: FiCalendar,
  FiCpu: FiCpu,
  FiDatabase: FiDatabase,
  FiEdit: FiEdit,
  FiHeadphones: FiHeadphones,
  FiPower: FiPower,
  FiCheckCircle: FiCheckCircle,  // Verificación
  FiUnlock: FiUnlock,  // Desbloqueo
  FiThumbsUp: FiThumbsUp,  // Aprobación
};

export default iconCatalog;
