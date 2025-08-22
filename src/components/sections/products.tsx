'use client';

import { motion } from 'framer-motion';
import { Baby, Car, Shield, Zap, Heart, Brain } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const products = [
	{
		id: 'cradai',
		title: 'DuVoX CradAI',
		subtitle: 'AI Babycare Assistant for the Next Billion',
		status: 'MVP Ready | Pre Launching Planned',
		description:
			'A powerful yet accessible AI system designed for young parents. Advanced cry detection, baby rash monitoring, and vital health tracking that works offline. Designed specifically for Rural and Urban India, bringing peace of mind to millions of families.',
		icon: Baby,
		features: [
			'Advanced cry pattern analysis',
			'Real-time health monitoring',
			'Offline-first architecture',
			'Affordable for Indian families',
			'Multi-language support',
			'Emergency alert system',
		],
		gradient: 'from-pink-500 to-rose-500',
		bgGradient:
			'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
	},
	{
		id: 'mobility',
		title: 'DuVoX Mobility Co-Pilot',
		subtitle: 'Your AI Co-Driver for Smart Mobility',
		status: 'Alpha Prototype | In Development',
		description:
			'An intelligent co-pilot that assists drivers with real-time safety alerts, EV diagnostics, and predictive driving feedback. Advanced accident risk detection with seamless integration for EV and autonomous vehicles.',
		icon: Car,
		features: [
			'Real-time safety monitoring',
			'EV battery optimization',
			'Predictive maintenance',
			'Accident prevention AI',
			'Route optimization',
			'Driver behavior analysis',
		],
		gradient: 'from-blue-500 to-cyan-500',
		bgGradient:
			'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
	},
];

export function ProductsSection() {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	return (
		<section
			className="py-20 bg-white dark:bg-gray-900"
			id="products"
		>
			<div className="container mx-auto px-4">
				<motion.div
					animate={inView ? { opacity: 1, y: 0 } : {}}
					className="text-center mb-16"
					initial={{ opacity: 0, y: 50 }}
					ref={ref}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
						Our Products
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
						Revolutionary AI solutions designed to enhance human life
						through intelligent automation and insights.
					</p>
				</motion.div>

				<div className="space-y-20">
					{products.map((product, index) => (
						<motion.div
							animate={inView ? { opacity: 1, y: 0 } : {}}
							className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
								index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
							}`}
							initial={{ opacity: 0, y: 50 }}
							key={product.id}
							transition={{ duration: 0.8, delay: index * 0.3 }}
						>
							{/* Product Info */}
							<div
								className={index % 2 === 1 ? 'lg:col-start-2' : ''}
							>
								<div className="mb-4">
									<span
										className={`inline-block px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r ${product.gradient} text-white`}
									>
										{product.status}
									</span>
								</div>

								<h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
									{product.title}
								</h3>

								<h4
									className={`text-xl mb-6 bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent font-semibold`}
								>
									{product.subtitle}
								</h4>

								<p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
									{product.description}
								</p>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
									{product.features.map(
										(feature, featureIndex) => (
											<motion.div
												animate={inView ? { opacity: 1, x: 0 } : {}}
												className="flex items-center space-x-3"
												initial={{ opacity: 0, x: -20 }}
												key={feature}
												transition={{
													duration: 0.5,
													delay:
														index * 0.3 +
														featureIndex * 0.1,
												}}
											>
												<div
													className={`w-2 h-2 rounded-full bg-gradient-to-r ${product.gradient}`}
												/>
												<span className="text-gray-700 dark:text-gray-300">
													{feature}
												</span>
											</motion.div>
										)
									)}
								</div>

								<div className="flex flex-col sm:flex-row gap-4">
									<Button
										size="lg"
										variant="outline"
									>
										Join Beta
									</Button>
								</div>
							</div>

							{/* Product Visual */}
							<div
								className={index % 2 === 1 ? 'lg:col-start-1' : ''}
							>
								<Card
									className={`p-8 bg-gradient-to-br ${product.bgGradient} border-0 shadow-2xl`}
								>
									<CardContent className="p-0 text-center">
										<motion.div
											className={`w-32 h-32 mx-auto mb-8 bg-gradient-to-r ${product.gradient} rounded-full flex items-center justify-center shadow-lg`}
											transition={{ duration: 0.3 }}
											whileHover={{ scale: 1.1, rotate: 5 }}
										>
											<product.icon className="w-16 h-16 text-white" />
										</motion.div>

										<div className="grid grid-cols-3 gap-4 mb-8">
											{product.id === 'cradai' ? (
												<>
													<div className="text-center">
														<Heart className="w-8 h-8 mx-auto mb-2 text-pink-500" />
														<div className="text-sm text-gray-600 dark:text-gray-400">
															Health Monitor
														</div>
													</div>
													<div className="text-center">
														<Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
														<div className="text-sm text-gray-600 dark:text-gray-400">
															Safety First
														</div>
													</div>
													<div className="text-center">
														<Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
														<div className="text-sm text-gray-600 dark:text-gray-400">
															AI Powered
														</div>
													</div>
												</>
											) : (
												<>
													<div className="text-center">
														<Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
														<div className="text-sm text-gray-600 dark:text-gray-400">
															Real-time
														</div>
													</div>
													<div className="text-center">
														<Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
														<div className="text-sm text-gray-600 dark:text-gray-400">
															Safety
														</div>
													</div>
													<div className="text-center">
														<Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
														<div className="text-sm text-gray-600 dark:text-gray-400">
															Intelligent
														</div>
													</div>
												</>
											)}
										</div>

										<div className="text-center">
											<div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
												Coming Soon
											</div>
											<div className="text-gray-600 dark:text-gray-400">
												Join our waitlist for early access
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}