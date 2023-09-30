import Meta from '@/utils/meta/Meta';
import { IMeta } from '@/utils/meta/meta.interface';
import { FC, PropsWithChildren } from 'react';
import styles from './Format.module.scss';
import { modalAtom } from '@/atoms/modalAtom';
import { useRecoilState } from 'recoil';

const Format: FC<PropsWithChildren<IMeta>> = ({ children, ...meta }) => {
	const [isShowing, setIsShowing] = useRecoilState(modalAtom);
	const layerModalMode: 'emailInvitation' | 'linkInvation' = 'emailInvitation';
	return (
		<>
			<Meta {...meta} />
			<main className={styles.main}>
				{isShowing && (
					<div className={styles.modal_mask}>
						<div className="w-[500px] h-[500px] bg-white border border-solid border-customDark p-6 flex">
							<div>modal_title</div>
							<div
								className="ml-auto font-bold text-lg cursor-pointer"
								onClick={() => setIsShowing(false)}
							>
								x
							</div>
						</div>
					</div>
				)}
				{children}
			</main>
		</>
	);
};

export default Format;
