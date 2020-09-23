import { createElement } from 'preact';

export default function Footer() {
	return (
		<footer>
			<div class="container">
				<a href="/" class="logo-font">
					conduit
				</a>
				<span class="attribution">
					An interactive learning project from{' '}
					<a href="https://thinkster.io">Thinkster</a>. Code &amp; design
					licensed under MIT.
				</span>
			</div>
		</footer>
	);
}