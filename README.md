# Cross-Platform App with Next.js, TypeScript, Tailwind CSS & Capacitor

A modern cross-platform application that works as both a web app and native mobile app using Next.js, TypeScript, Tailwind CSS, and Capacitor.js.

## 🚀 Features

- **Web App**: Full-featured web application with modern UI/UX
- **Mobile App**: Native mobile experience on iOS and Android
- **Cross-Platform**: Single codebase for all platforms
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, utility-first CSS framework
- **Responsive Design**: Optimized for all screen sizes
- **Dark Mode**: Built-in dark mode support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Mobile**: Capacitor.js 7
- **Platforms**: Web, iOS, Android

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd capacitor
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Development

### Web Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Mobile Development

#### Android
```bash
# Build and sync for Android
npm run build:mobile

# Run on Android device/emulator
npm run android
```

#### iOS
```bash
# Add iOS platform (macOS only)
npm run add:ios

# Build and sync for iOS
npm run build:mobile

# Run on iOS device/simulator
npm run ios
```

## 📱 Mobile Setup

### Prerequisites

#### Android
- Android Studio
- Android SDK
- Java Development Kit (JDK)

#### iOS (macOS only)
- Xcode
- iOS Simulator or physical device

### Platform Setup

1. **Android Setup**:
   ```bash
   # Android platform is already added
   # Open Android Studio and sync the project
   npx cap open android
   ```

2. **iOS Setup** (macOS only):
   ```bash
   # Add iOS platform
   npm run add:ios
   
   # Open Xcode
   npx cap open ios
   ```

## 🔧 Configuration

### Capacitor Configuration
The app is configured in `capacitor.config.ts`:
- **App ID**: `com.example.app`
- **App Name**: `capacitor`
- **Web Directory**: `out` (Next.js static export)
- **Android Scheme**: `https`

### Next.js Configuration
Configured for static export in `next.config.ts`:
- Static export enabled
- Trailing slash enabled
- Unoptimized images for mobile compatibility

## 📁 Project Structure

```
capacitor/
├── src/
│   └── app/
│       ├── page.tsx          # Main app page
│       ├── layout.tsx        # App layout
│       └── globals.css       # Global styles
├── android/                  # Android platform files
├── ios/                      # iOS platform files (if added)
├── out/                      # Static build output
├── public/                   # Static assets
├── capacitor.config.ts       # Capacitor configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies and scripts
```

## 🚀 Deployment

### Web Deployment
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

### Mobile Deployment

#### Android
1. Build the app: `npm run build:mobile`
2. Open Android Studio: `npx cap open android`
3. Build APK/AAB in Android Studio
4. Upload to Google Play Store

#### iOS
1. Build the app: `npm run build:mobile`
2. Open Xcode: `npx cap open ios`
3. Build and archive in Xcode
4. Upload to App Store Connect

## 🔄 Development Workflow

1. **Make changes** to your React components in `src/app/`
2. **Test on web**: `npm run dev`
3. **Build for mobile**: `npm run build:mobile`
4. **Test on mobile**: `npm run android` or `npm run ios`
5. **Repeat** as needed

## 📱 Platform Detection

The app automatically detects the platform and shows relevant information:
- **Web**: Desktop browser
- **Android**: Android device/emulator
- **iOS**: iPhone/iPad device/simulator

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Use Tailwind CSS classes in components
- Customize Tailwind config in `tailwind.config.ts`

### Components
- Add new pages in `src/app/`
- Create reusable components in `src/components/`
- Update routing in `src/app/layout.tsx`

### Capacitor Plugins
Add native functionality with Capacitor plugins:
```bash
npm install @capacitor/camera @capacitor/geolocation
npx cap sync
```

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Ensure all dependencies are installed
2. **Mobile sync issues**: Run `npx cap sync` after changes
3. **Android build fails**: Check Android Studio and SDK setup
4. **iOS build fails**: Ensure Xcode is properly configured

### Useful Commands
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset Capacitor
npx cap sync

# Check Capacitor status
npx cap doctor
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the [Capacitor documentation](https://capacitorjs.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs)
- Open an issue in this repository
